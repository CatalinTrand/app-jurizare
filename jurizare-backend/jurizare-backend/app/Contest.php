<?php
/**
 * Created by PhpStorm.
 * User: Catalin
 * Date: 14/10/2019
 * Time: 18:47
 */

namespace App;


use Illuminate\Database\Eloquent\Model;

class Contest extends Model
{
    protected $fillable = [
        'name', 'description', 'participants', 'content', 'active'
    ];
}