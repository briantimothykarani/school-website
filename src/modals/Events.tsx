function Events({ settings }: any) {
  return (
    <>
      <div className="w-120 h-120 bg-white rounded text-center justify-center m-2">
        <p className='text-center text-2xl'>Events</p>
<div>
              {events.length === 0 ? (
              ) : (
                events.map((ev) => (
                  <div
                    key={ev.id}
                  >
                    <div>
                          {ev.title}
                      {ev.event_date}
                      {ev.event_time}
                        {ev.location}
                      </div>
                    </div>
             
      </div>
    </>
  );
}
export default Events;
