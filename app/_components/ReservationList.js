"use client";

import { useOptimistic } from "react";
import ReservationCard from "./ReservationCard";
import { deleteBooking } from "../_lib/action";

function ReservationList({ bookings }) {
  const [optmisticBookings, optmisticDelete] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );
  async function handleDelete(bookingId) {
    optmisticDelete(bookingId);
    await deleteBooking(bookingId);
  }
  return (
    <ul className="space-y-6">
      {optmisticBookings.map((booking) => (
        <ReservationCard
          booking={booking}
          onDelete={handleDelete}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationList;
