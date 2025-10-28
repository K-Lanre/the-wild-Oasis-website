"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must logged in");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please provide a Valid national ID");
  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error("you must be logged in");

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  const { error } = await supabase
    .from("bookings")
    .insert([newBooking])
    // So that the newly created object gets returned!
    .select()
    .single();

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

export async function deleteBooking(bookingId) {
  const session = await auth();
  if (!session) throw new Error("you must be logged in");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  console.log(guestBookingsIds);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("you are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservation");
}

export async function updateReservation(formData) {
  const reservationId = Number(formData.get("reservationId"));
  //1. authentication
  const session = await auth();
  if (!session) throw new Error("You need to be loged in. ");
  console.log(formData);

  //2. AUthorization
  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  console.log(guestBookingsIds);

  if (!guestBookingsIds.includes(reservationId))
    throw new Error("you are not allowed to update this booking");
  console.log(guestBookingsIds);

  // 3.Building update data
  const observations = formData.get("observations").slice(0, 1000);
  const numGuests = Number(formData.get("numGuests"));
  const updatedData = { observations, numGuests };

  //4. the Mutation
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedData)
    .eq("id", reservationId);

  // 5. error handling
  if (error) throw new Error("Booking could not be updated");

  // 6.revalidating
  revalidatePath(`/account/edit/reservation/edit/${reservationId}`);
  revalidatePath("/account/reservation");

  // 7.Redirection
  redirect("/account/reservations");
}

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
