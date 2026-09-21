<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

/**
 * Scaffolds a new domain entity in one shot:
 *   php artisan make:domain Setoran
 *
 * Generates: Model, Controller, StoreRequest, UpdateRequest, Resource, Service.
 */
class MakeDomainCommand extends Command
{
    protected $signature = 'make:domain {name : The domain entity name (PascalCase)}
                            {--admin : Generate in Admin controller namespace instead of root}';

    protected $description = 'Scaffold a complete domain entity (Model, Controller, Requests, Resource, Service)';

    public function handle(): int
    {
        $name = Str::studly($this->argument('name'));
        $isAdmin = $this->option('admin');

        $this->info("Scaffolding domain: {$name}");

        $created = [];

        // Model
        $this->callSilently('make:model', ['name' => $name]);
        $created[] = "app/Models/{$name}.php";

        // Controller
        $controllerNamespace = $isAdmin ? "Admin/{$name}Controller" : "{$name}Controller";
        $this->callSilently('make:controller', [
            'name' => $controllerNamespace,
            '--api' => true,
        ]);
        $created[] = "app/Http/Controllers/{$controllerNamespace}.php";

        // Form Requests
        $requestPrefix = $isAdmin ? "Admin/" : "";
        $this->callSilently('make:request', [
            'name' => "{$requestPrefix}Store{$name}Request",
        ]);
        $created[] = "app/Http/Requests/{$requestPrefix}Store{$name}Request.php";

        $this->callSilently('make:request', [
            'name' => "{$requestPrefix}Update{$name}Request",
        ]);
        $created[] = "app/Http/Requests/{$requestPrefix}Update{$name}Request.php";

        // API Resource
        $this->callSilently('make:resource', [
            'name' => "{$name}Resource",
        ]);
        $created[] = "app/Http/Resources/{$name}Resource.php";

        // Service (manual — no artisan command for services)
        $servicePath = app_path("Services/{$name}Service.php");
        if (!file_exists($servicePath)) {
            if (!is_dir(dirname($servicePath))) {
                mkdir(dirname($servicePath), 0755, true);
            }

            $serviceContent = <<<PHP
<?php

namespace App\Services;

/**
 * Business logic for {$name}.
 */
class {$name}Service
{
    //
}
PHP;
            file_put_contents($servicePath, $serviceContent);
            $created[] = "app/Services/{$name}Service.php";
        }

        $this->info('Created files:');
        foreach ($created as $file) {
            $this->line("  ✓ {$file}");
        }

        $this->newLine();
        $this->info("Next steps:");
        $this->line("  1. Define fillable fields and relationships in the Model");
        $this->line("  2. Add validation rules to the Form Requests");
        $this->line("  3. Implement controller actions using the Service");
        $this->line("  4. Add routes in routes/api.php");

        return self::SUCCESS;
    }
}
