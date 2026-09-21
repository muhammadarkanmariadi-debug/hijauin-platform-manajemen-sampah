<?php

namespace App\Enums;

/**
 * Role codes — the stable identifiers used in permissions checks.
 * Always check against these codes, not numeric IDs.
 *
 * @see docs/SCHEMA.md §roles
 */
enum RoleCode: string
{
    case Nasabah = 'nasabah';
    case AdminUnit = 'admin_unit';
    case PlatformOps = 'platform_ops';
}
