<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Carbon\Carbon;

class OrderAssignmentService
{
    /**
     * Auto-assign order to available petugas
     */
    public function autoAssignOrder(Order $order)
    {
        // Get address zone/city
        $address = $order->address;
        $zone = $address->city;

        // Find available petugas in the same zone
        $availablePetugas = User::where('role', 'petugas')
            ->where('status', 'active')
            ->where('zone', $zone)
            ->get();

        if ($availablePetugas->isEmpty()) {
            // If no petugas in exact zone, find nearby or any available
            $availablePetugas = User::where('role', 'petugas')
                ->where('status', 'active')
                ->get();
        }

        if ($availablePetugas->isEmpty()) {
            return false;
        }

        // Find petugas with least workload on that day
        $scheduledDate = Carbon::parse($order->scheduled_time)->format('Y-m-d');

        $petugasWorkload = [];
        foreach ($availablePetugas as $petugas) {
            $workload = Order::where('assigned_petugas_id', $petugas->id)
                ->whereDate('scheduled_time', $scheduledDate)
                ->whereIn('status', ['assigned', 'on_the_way'])
                ->count();

            $petugasWorkload[$petugas->id] = $workload;
        }

        // Sort by workload ascending
        asort($petugasWorkload);
        $selectedPetugasId = array_key_first($petugasWorkload);

        // Assign order
        $order->assignToPetugas($selectedPetugasId);

        // Send notification (implement later)
        // NotificationService::notifyPetugasNewOrder($order);

        return true;
    }

    /**
     * Reassign order to another petugas
     */
    public function reassignOrder(Order $order, $reason = null)
    {
        // Mark current assignment as failed
        $order->update([
            'petugas_notes' => $reason,
            'assigned_petugas_id' => null,
            'status' => 'pending',
        ]);

        // Try to assign to another petugas
        return $this->autoAssignOrder($order);
    }

    /**
     * Manual assign by admin
     */
    public function manualAssignOrder(Order $order, $petugasId)
    {
        $petugas = User::where('id', $petugasId)
            ->where('role', 'petugas')
            ->where('status', 'active')
            ->first();

        if (!$petugas) {
            return false;
        }

        $order->assignToPetugas($petugasId);
        return true;
    }
}
