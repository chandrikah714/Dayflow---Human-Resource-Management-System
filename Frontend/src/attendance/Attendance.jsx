/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import CheckInButton from "./CheckInButton";
import AttendanceTable from "./AttendanceTable";
import "./Attendance.css";

const API_URL = "/api/attendance";
import { useAuth } from '../auth/AuthContext';

// Configure the employee used by this starter application in frontend/.env.local.
// Authentication is not implemented in this source version, so the API requires
// an explicit employee id rather than silently modifying an arbitrary record.
function Attendance() {

    const { user } = useAuth();
    const isAdmin = user.role === 'ADMIN';

    const [todayAttendance, setTodayAttendance] =
        useState(null);

    const [attendance, setAttendance] =
        useState([]);

    const [view, setView] =
        useState("daily");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    async function loadAttendance() {

        try {

            setLoading(true);

            const todayResponse =
                await fetch(
                    `${API_URL}/today?employeeId=${user.id}`
                );

            if (!todayResponse.ok) {
                throw new Error(
                    "Unable to load today's attendance."
                );
            }

            const todayData =
                await todayResponse.json();

            setTodayAttendance(todayData);


            const historyResponse = await fetch(isAdmin ? `${API_URL}/all` : `${API_URL}/my?employeeId=${user.id}`);

            if (!historyResponse.ok) {
                throw new Error(
                    "Unable to load attendance history."
                );
            }

            const historyData = await historyResponse.json();
            if (isAdmin) {
                const peopleResponse = await fetch('/api/employees', { credentials: 'include' });
                const people = peopleResponse.ok ? await peopleResponse.json() : [];
                const names = new Map(people.map((person) => [person.id, person.fullName]));
                setAttendance(historyData.map((record) => ({ ...record, employeeName: names.get(record.employeeId) || `Employee #${record.employeeId}` })));
            } else setAttendance(historyData);

        } catch (error) {

            setError(error.message);

        } finally {

            setLoading(false);
        }
    }

    useEffect(() => {
        // Schedule the initial request after mount instead of synchronously
        // changing state while React is committing this component.
        const requestId = window.setTimeout(() => {
            void loadAttendance();
        }, 0);
        return () => window.clearTimeout(requestId);
    }, []);


    const handleAttendanceUpdate =
        (updatedAttendance) => {

            setTodayAttendance(
                updatedAttendance
            );

            setAttendance(previous => {

                const alreadyExists =
                    previous.some(
                        item =>
                            item.id ===
                            updatedAttendance.id
                    );

                if (alreadyExists) {

                    return previous.map(item =>
                        item.id ===
                        updatedAttendance.id
                            ? updatedAttendance
                            : item
                    );
                }

                return [
                    updatedAttendance,
                    ...previous
                ];
            });
        };


    const formatTime = (time) => {

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
    };


    return (

        <div className="attendance-page">

            <div className="attendance-header">

                <h1>{isAdmin ? 'Team Attendance' : "Today's Attendance"}</h1>

                <p>
                    {isAdmin ? 'View employee check-in and check-out activity across the team.' : 'Keep track of your daily attendance'}
                </p>

            </div>


            {error && (
                <div className="error-box">
                    {error}
                </div>
            )}


            <div className="today-card">

                <div className="time-card">

                    <h3>Check In</h3>

                    <p>
                        {formatTime(
                            todayAttendance?.checkIn
                        )}
                    </p>

                </div>


                <div className="time-card">

                    <h3>Check Out</h3>

                    <p>
                        {formatTime(
                            todayAttendance?.checkOut
                        )}
                    </p>

                </div>


                <div className="status-card">

                    <h3>Status</h3>

                    <p>
                        {todayAttendance?.status ||
                         "NOT CHECKED IN"}
                    </p>

                </div>

            </div>


            <CheckInButton
                employeeId={user.id}
                attendance={todayAttendance}
                onUpdate={handleAttendanceUpdate}
            />


            <div className="view-buttons">

                <button
                    className={
                        view === "daily"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setView("daily")
                    }
                >
                    Daily View
                </button>


                <button
                    className={
                        view === "weekly"
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        setView("weekly")
                    }
                >
                    Weekly View
                </button>

            </div>


            <div className="history-section">

                <h2>
                    Attendance History
                </h2>

                {loading ? (

                    <p>Loading attendance...</p>

                ) : (

                    <AttendanceTable
                        attendance={attendance}
                        view={view}
                        showEmployee={isAdmin}
                    />

                )}

            </div>

        </div>
    );
}

export default Attendance;
