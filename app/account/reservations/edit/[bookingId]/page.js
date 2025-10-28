import ReservationButton from "@/app/_components/ReservationButton";
import SubmitButton from "@/app/_components/SubmitButton";
import { updateReservation } from "@/app/_lib/action";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const { bookingId } = params;
  const { id, numGuests, observations, cabinId } = await getBooking(bookingId);
  const { maxCapacity } = await getCabin(cabinId);

  // CHANGE
  // const reservationId = id;
  // const maxCapacity = numGuests;

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{bookingId}
      </h2>

      <form
        action={updateReservation}
        className="bg-primary-900 py-8 px-12 text-lg flex gap-6 flex-col"
      >
        <div className="space-y-2">
          <label htmlFor="numGuests">How many guests?</label>
          <select
            defaultValue={numGuests}
            name="numGuests"
            id="numGuests"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
            required
          >
            <option value="" key="">
              Select number of guests...
            </option>
            {Array.from({ length: maxCapacity }, (_, i) => i + 1).map((x) => (
              <option value={x} key={x}>
                {x} {x === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="observations">
            Anything we should know about your stay?
          </label>
          <textarea
            defaultValue={observations}
            name="observations"
            className="px-5 py-3 bg-primary-200 text-primary-800 w-full shadow-sm rounded-sm"
          />
        </div>
        <input type="hidden" name="reservationId" value={id} />

        <div className="flex justify-end items-center gap-6">
          <SubmitButton pendingLabel="Updating...">
            Update reservation
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}

// function Button() {
//   const { pending } = useFormStatus();
//   return (
//     <button
//       disabled={pending}
//       className="bg-accent-500 px-8 py-4 text-primary-800 font-semibold hover:bg-accent-600 transition-all disabled:cursor-not-allowed disabled:bg-gray-500 disabled:text-gray-300"
//     >
//       {!pending ? "Update reservation" : "Updating...."}
//     </button>
//   );
// }
