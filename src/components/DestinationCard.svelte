<script>
export let number;
export let location;
export let arrivalDateTime;
export let departureDateTime;

import {DateTime} from "luxon";

$: arrival = DateTime.fromISO(arrivalDateTime);
$: departure = DateTime.fromISO(departureDateTime);




</script>

<style>
.destination-card {
    /* background: linear-gradient(270deg, var(--highlight-color), transparent 67%); */
    margin: 1.5rem;
}

</style>

<div class="destination-card">
    <h1>{number}. {location}</h1>
    <p>Arrive: {arrival.toLocaleString(DateTime.DATETIME_MED)}</p>
    <p>Depart: {departure.toLocaleString(DateTime.DATETIME_MED)}</p>
</div>