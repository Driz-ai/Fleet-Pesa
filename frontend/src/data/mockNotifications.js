const today = new Date();

function hoursAgo(hours, minutes = 0) {
  const date = new Date(today);

  date.setHours(date.getHours() - hours);
  date.setMinutes(date.getMinutes() - minutes);

  return date.toISOString();
}



export const MOCK_DRIVER_NOTIFICATIONS = [
  {
    id: "driver-notification-1",
    type: "customer_payment_received",
    title: "Payment received",
    message: "Customer paid KES 500.",
    amount: 500,
    customer_phone: "0712••4584",
    vehicle_registration: "KDJ 421A",
    is_read: false,
    created_at: hoursAgo(0, 8),
  },

  {
    id: "driver-notification-2",
    type: "customer_payment_received",
    title: "Payment received",
    message: "Customer paid KES 150.",
    amount: 150,
    customer_phone: "0701••6226",
    vehicle_registration: "KDJ 421A",
    is_read: false,
    created_at: hoursAgo(0, 25),
  },

  {
    id: "driver-notification-3",
    type: "daily_remittance_sent",
    title: "Daily remittance sent",
    message: "KES 4,500 was sent to the owner.",
    amount: 4500,
    vehicle_registration: "KDJ 421A",
    is_read: true,
    created_at: hoursAgo(2),
  },

  {
    id: "driver-notification-4",
    type: "vehicle_assigned",
    title: "Vehicle assigned",
    message: "KDJ 421A has been assigned to you.",
    vehicle_registration: "KDJ 421A",
    vehicle_model: "Toyota Hiace",
    is_read: false,
    created_at: hoursAgo(3),
  },

  {
    id: "driver-notification-5",
    type: "customer_payment_received",
    title: "Payment received",
    message: "Customer paid KES 300.",
    amount: 300,
    customer_phone: "0798••1045",
    vehicle_registration: "KDJ 421A",
    is_read: true,
    created_at: hoursAgo(6),
  },
];



export const MOCK_OWNER_NOTIFICATIONS = [
  {
    id: "owner-notification-1",
    type: "remittance_received",
    title: "Daily remittance received",
    message: "Peter Omondi sent KES 4,500.",
    amount: 4500,
    driver_name: "Peter Omondi",
    vehicle_registration: "KDJ 421A",
    is_read: false,
    created_at: hoursAgo(0, 15),
  },

  {
    id: "owner-notification-2",
    type: "remittance_received",
    title: "Daily remittance received",
    message: "James Mwangi sent KES 3,800.",
    amount: 3800,
    driver_name: "James Mwangi",
    vehicle_registration: "KCA 218B",
    is_read: false,
    created_at: hoursAgo(1),
  },

  {
    id: "owner-notification-3",
    type: "remittance_received",
    title: "Daily remittance received",
    message: "David Kamau sent KES 5,200.",
    amount: 5200,
    driver_name: "David Kamau",
    vehicle_registration: "KDB 712C",
    is_read: true,
    created_at: hoursAgo(3),
  },

  {
    id: "owner-notification-4",
    type: "remittance_received",
    title: "Daily remittance received",
    message: "Samuel Kariuki sent KES 4,100.",
    amount: 4100,
    driver_name: "Samuel Kariuki",
    vehicle_registration: "KDC 445D",
    is_read: false,
    created_at: hoursAgo(4),
  },
];



export const MOCK_OWNER_COLLECTIONS = MOCK_OWNER_NOTIFICATIONS.map(
  (item, index) => ({
    id: `collection-${index + 1}`,
    driver_name: item.driver_name,
    vehicle_registration: item.vehicle_registration,
    amount: item.amount,
    status: "received",
    time: new Intl.DateTimeFormat("en-KE", {
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(item.created_at)),
  })
);