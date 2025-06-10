import useFetchData from "../../hooks/useFetchData"
import { BASE_URL } from "../../config"
import DoctorCard from './../../components/Doctors/DoctorCard'
import Loading from "../../components/Loader/Loading"
import Error from "../../components/Error/Error"

const MyBookings = () => {
    const {data:appointments, loading, error} = useFetchData(`${BASE_URL}/users/appointments/my-appointments`)

    return (
        <div className="mt-8">
            {loading && !error && <Loading/>}

            {error && !loading && <Error errMessage={error} />}

            {!loading && !error && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-32 gap-y-6">
                    {appointments.map(doctor => (
                        <div key={doctor._id} className="transform transition-all duration-300 hover:scale-[1.02]">
                            <DoctorCard doctor={doctor} />
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && appointments.length === 0 && (
                <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
                    You did not book any doctor yet!
                </h2>
            )}
        </div>
    )
}

export default MyBookings
