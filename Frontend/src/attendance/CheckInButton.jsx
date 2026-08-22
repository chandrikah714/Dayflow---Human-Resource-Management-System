import { useState } from "react";

const API_URL = "/api/attendance";

function CheckInButton({
    employeeId,
    attendance,
    onUpdate
}) {

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const handleCheckIn = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/check-in?employeeId=${employeeId}`,
                    {
                        method: "POST"
                    }
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(message);
            }

            const data =
                await response.json();

            onUpdate(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    const handleCheckOut = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await fetch(
                    `${API_URL}/check-out?employeeId=${employeeId}`,
                    {
                        method: "POST"
                    }
                );

            if (!response.ok) {

                const message =
                    await response.text();

                throw new Error(message);
            }

            const data =
                await response.json();

            onUpdate(data);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };


    const checkedIn =
        attendance?.checkIn != null;

    const checkedOut =
        attendance?.checkOut != null;


    return (

        <div className="check-in-section">

            <div className="attendance-buttons">

                <button
                    onClick={handleCheckIn}
                    disabled={
                        loading || checkedIn
                    }
                >
                    {loading
                        ? "Processing..."
                        : "Check In"}
                </button>


                <button
                    onClick={handleCheckOut}
                    disabled={
                        loading ||
                        !checkedIn ||
                        checkedOut
                    }
                >
                    {loading
                        ? "Processing..."
                        : "Check Out"}
                </button>

            </div>


            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}

        </div>
    );
}

export default CheckInButton;
