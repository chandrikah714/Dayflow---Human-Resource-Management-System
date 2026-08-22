function formatTime(time) {

    if (!time) {
        return "--";
    }

    const date = new Date(time);

    if (Number.isNaN(date.getTime())) {
        return "--";
    }

    return date.toLocaleTimeString(
        [],
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function formatDate(date) {

    if (!date) {
        return "--";
    }

    const d = new Date(date);

    return d.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


function AttendanceTable({
    attendance,
    view,
    showEmployee = false
}) {

    let data = attendance;


    if (view === "weekly") {

        const today = new Date();

        const startOfWeek =
            new Date(today);

        const day =
            today.getDay();

        const difference =
            day === 0
                ? 6
                : day - 1;

        startOfWeek.setDate(
            today.getDate() - difference
        );

        startOfWeek.setHours(
            0, 0, 0, 0
        );


        data = attendance.filter(
            item => {

                const itemDate =
                    new Date(item.date);

                return (
                    itemDate >= startOfWeek &&
                    itemDate <= today
                );
            }
        );
    }


    if (data.length === 0) {

        return (
            <div className="empty-attendance">
                No attendance records found.
            </div>
        );
    }


    return (

        <div className="attendance-table-container">

            <table className="attendance-table">

                <thead>

                    <tr>
                        {showEmployee && <th>Employee</th>}
                        <th>Date</th>
                        <th>Check In</th>
                        <th>Check Out</th>
                        <th>Status</th>
                    </tr>

                </thead>


                <tbody>

                    {data.map(item => (

                        <tr key={item.id}>

                            {showEmployee && <td>{item.employeeName}</td>}

                            <td>
                                {formatDate(
                                    item.date
                                )}
                            </td>

                            <td>
                                {formatTime(
                                    item.checkIn
                                )}
                            </td>

                            <td>
                                {formatTime(
                                    item.checkOut
                                )}
                            </td>

                            <td>

                                <span
                                    className={
                                        `status ${item.status.toLowerCase()}`
                                    }
                                >
                                    {item.status}
                                </span>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
}

export default AttendanceTable;
