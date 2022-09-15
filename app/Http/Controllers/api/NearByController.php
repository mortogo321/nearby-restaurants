<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;

class NearByController extends Controller
{
    public function restaurant(Request $request)
    {
        $validator = Validator::make($request->input(), [
            "lat" => 'required',
            "lng" => 'required',
        ]);

        if ($validator->fails()) {
            return response($validator->errors(), 422);
        }

        $googleMapApi = config('google.mapApi');
        $lat = $request->input('lat');
        $lng = $request->input('lng');
        $url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={$lat},{$lng}&type=restaurant&radius=500000&key={$googleMapApi}";

        $response = Http::get($url);

        return response($response->json());
    }
}
