<?php

namespace App\Http\Controllers;

abstract class Controller
{
    function generateLuhnDigit($number)
    {
        $sum = 0;
        $alt = true;

        for ($i = strlen($number) - 1; $i >= 0; $i--) {
            $n = intval($number[$i]);

            if ($alt) {
                $n *= 2;
                if ($n > 9) {
                    $n -= 9;
                }
            }

            $sum += $n;
            $alt = !$alt;
        }

        return (10 - ($sum % 10)) % 10;
    }
}
