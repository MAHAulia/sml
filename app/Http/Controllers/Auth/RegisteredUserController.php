<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\RoleUser;
use App\Models\User;
use App\Models\UserAccount;
use App\Models\UserSubscription;
use Carbon\Carbon;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            DB::beginTransaction();


            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            RoleUser::create([
                'user_id' => $user->id,
                'role_id' => 2,
            ]);

            UserSubscription::create([
                'user_id' => $user->id,
                'ai' => true,
                'dashboard_response' => true,
                'expired_at' => Carbon::now()->endOfMonth()->toDateString()
            ]);

            $userAccount = new UserAccount();
            $userAccount->user_id = $user->id;
            $userAccount->account_no = "0";
            $userAccount->saldo = 0;
            $userAccount->save();

            $userAccount->account_no = str_pad($userAccount->id, "12", "0", STR_PAD_LEFT);
            $userAccount->save();

            event(new Registered($user));

            Auth::login($user);

            DB::commit();
            return to_route('dashboard');
        } catch (\Throwable $th) {
            DB::rollBack();
            dd($th->getMessage());
            return redirect()->back()->with("error", "Gagal melakukan pendaftaran");
        }
    }
}
