<?php
/**
 * Created by PhpStorm.
 * User: Catalin
 * Date: 14/10/2019
 * Time: 18:47
 */

namespace App;


use Illuminate\Database\Eloquent\Model;

class Grade extends Model
{
    protected $fillable = [
        'contest_id', 'jury_id', 'content'
    ];
}