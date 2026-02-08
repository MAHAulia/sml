<?php

namespace App\AiHelper;

class OpenRouterAI
{
    private $apiUrl;
    private $apiKey;
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        $this->apiUrl = config('app.openrouter.url', "");
        $this->apiKey = config('app.openrouter.api_key', "");
    }

    public function chat($message)
    {
        $client = new \GuzzleHttp\Client();
        $response = $client->post($this->apiUrl, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => config('app.openrouter.model'),
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => [
                            [
                                "type" => "text",
                                "text" => "You are a helpful assistant that helps users fill out forms. You will be given a form and a question, and you will provide a response based on the form's structure and the question asked. If the question is not related to the form, you will respond with 'I can only assist with form-related questions.'",
                            ],
                            [
                                "type" => "text",
                                "text" => `You should respond with a JSON object that contains form component for example. [{"id":"question-1751214716415","type":"Title","title":"Webinar","subtitle":"Deskripsi Webinar","placeholder":null,"required":"0","paragraph":"0","addOtherOption":"0","inputType":"integer","minValue":null,"maxValue":null,"prefix":null,"suffix":null,"ratingStyle":"star","datePickerType":"date","timeFormat":"AM\/PM","disablePastDates":"0","disableFutureDates":"0","imageTitle":null,"imageCaption":null,"imageUrl":null,"videoUrl":null,"videoTitle":null,"videoCaption":null},{"id":"question-1751214730774","type":"Image","title":null,"subtitle":null,"placeholder":null,"required":"0","paragraph":"0","addOtherOption":"0","inputType":"integer","minValue":null,"maxValue":null,"prefix":null,"suffix":null,"ratingStyle":"star","datePickerType":"date","timeFormat":"AM\/PM","disablePastDates":"0","disableFutureDates":"0","imageTitle":"Banner","imageCaption":"Banert Acara","imageUrl":"data:image\/png;base64,iVBORw0KGgoAAAA`,
                            ],
                            [
                                "type" => "text",
                                "text" => "HUGE TEXT BODY",
                                "cache_control" => [
                                    "type" => "ephemeral"
                                ]
                            ],
                        ]
                    ],
                    [
                        'role' => 'user',
                        'content' => $message
                    ]
                ],
                "response_format" => [
                    "type" => "json_schema",
                    "json_schema" => [
                        "name" => "formulir",
                        "strict" => true,
                        "schema" => [
                            "type" => "object",
                            "properties" => [
                                "formulir" => [
                                    "type" => "array",
                                    "description" => "List for component",
                                    "items" => [
                                        "type" => "object",
                                        "properties" => [
                                            "id" => [
                                                "type" => "string",
                                                "description" => "form id"
                                            ],
                                            "type" => [
                                                "type" => ["Text input", "Multiple Choice", "Checkbox", "Dropdown", "Rating", "Date", "Time", "File Upload", "Image", "Video", "Title"],
                                                "description" => "Type of the form component"
                                            ],
                                            "title" => [
                                                "type" => ["string", "number", "boolean", "null"],
                                                "description" => "The title of the field"
                                            ],
                                            "subtitle" => [
                                                "type" => "string",
                                                "description" => "The subtitle of the field"
                                            ],
                                            "placeholder" => [
                                                "type" => "string",
                                                "description" => "The placeholder text for the field"
                                            ],
                                            "required" => [
                                                "type" => "boolean",
                                                "description" => "Whether the field is required or not"
                                            ],
                                            "paragraph" => [
                                                "type" => "boolean",
                                                "description" => "Whether the field is a paragraph or not"
                                            ],
                                            "options" => [
                                                "type" => "array",
                                                "description" => "The options for the field"
                                            ],
                                            "addOtherOption" => [
                                                "type" => "boolean",
                                                "description" => "Whether to add an 'Other' option"
                                            ],
                                            "inputType" => [
                                                "type" => "string",
                                                "description" => "The type of input for the field"
                                            ],
                                            "prefix" => [
                                                "type" => "string",
                                                "description" => "The prefix of the field"
                                            ],
                                            "suffix" => [
                                                "type" => "string",
                                                "description" => "The suffix of the field"
                                            ],
                                            "ratingStyle" => [
                                                "type" => "string",
                                                "description" => "The style of the rating field"
                                            ],
                                            "datePickerType" => [
                                                "type" => "string",
                                                "description" => "The type of date picker for the field"
                                            ],
                                            "timeFormat" => [
                                                "type" => "string",
                                                "description" => "The time format of the field"
                                            ],
                                            "disablePastDates" => [
                                                "type" => "string",
                                                "description" => "The time format of the field"
                                            ],
                                            "disableFutureDates" => [
                                                "type" => "string",
                                                "description" => "The time format of the field"
                                            ],
                                        ],
                                        "required" => ["id", "type", "title", "subtitle", "placeholder", "required", "paragraph", "addOtherOption", "inputType", "prefix", "suffix", "ratingStyle", "datePickerType", "timeFormat", "disablePastDates", "disableFutureDates"]
                                    ]
                                ],
                            ],
                            "required" => ["formulir"]
                        ]
                    ]
                ],
            ]
        ]);

        return json_decode($response->getBody(), true);
    }
}
