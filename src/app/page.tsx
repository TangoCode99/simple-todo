import List from "./components/List";

const date = new Date();
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]
const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function Home() {
  return (
    <div className="justify-items-center w-auto">
      <h1 className="py-4 mt-2 text-3xl font-bold border-b-2">Welcome, Tango! Today is {weekday[date.getDay()]}, {months[date.getMonth()]} {date.getDate()}.</h1>
      <h1 className="py-4 text-2xl font-semibold">Here is what you need to tackle today.</h1>
      <div className="flex justify-evenly w-full">
        <List title="Tasks"/>
        <List title="In-Progress"/>
        <List title="Completed"/>
      </div>
    </div>
  );
}
