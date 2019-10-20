<?php

namespace App\Http\Controllers;

use App\Contest;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ContestController extends Controller
{
    public function index() {
        return response()->json([Contest::all(),200]);
    }

    public function create(Request $request) {
        $contest = new Contest();
        $contest->name = $request->name;
        $contest->description = $request->description;
        $contest->participants = $request->participants;
        $contest->content = $request->contentt;

        if($contest->save)
            return response()->json([$contest->id,201]);

        return response()->json(["There was an error",500]);
    }

    public function getActive() {
        return response()->json([Contest::all(),200]);
    }
}
