import { useEffect, useState } from 'react'
import Global from '../helpers/Global'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const ListVehicles = ({ token }) => {
  const [residentsVehicles, setResidentsVehicles] = useState([])
  const [officialsVehicles, setOfficialsVehicles] = useState([])
  const [resident, setResident] = useState(true)
  const [official, setOfficial] = useState(false)
  const [closeMonth, setCloseMonth] = useState(false)
  const [month, setMonth] = useState([])
  const [fileName, setFileName] = useState('')

  useEffect(() => {
    fetch(Global.url + 'vehicles/list', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        setResidentsVehicles(data.data.filter(item => item.vehicleType == 'resident'))
        setOfficialsVehicles(data.data.filter(item => item.vehicleType == 'official'))
      })
  }, [token])

  const handleDelete = id => {
    fetch(Global.url + 'vehicles/vehicle/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          toast.success('The vehicles has been delete from the list')
          setResidentsVehicles(residentsVehicles.filter(item => item._id !== id))
          setOfficialsVehicles(officialsVehicles.filter(item => item._id !== id))
        }
      })
      .catch(error => {
        toast.error(error)
      })
  }
  const handleResidentClick = () => {
    setOfficial(false)
    setCloseMonth(false)
    setResident(true)
  }
  const handleOfficialClick = () => {
    setResident(false)
    setCloseMonth(false)
    setOfficial(true)
  }
  const handleCloseMonth = () => {
    fetch(Global.url + 'vehicles/closeMonth', {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.status == 'Success') {
          setMonth(data.dataPayments)
          setCloseMonth(true)
          setResident(false)
        }
      })
  }
  const handleGenerate = () => {
    if (fileName.length <= 3) {
      toast.error('The file name must have at least 4 characters')
      return
    }

    const data = {
      fileName: fileName,
      month,
    }

    fetch(Global.url + 'vehicles/registerMonth', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Authorization: token,

        'Content-type': 'application/json',
      },
    })
      .then(response => response.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)

        // Create a new link element
        const link = document.createElement('a')
        link.href = url

        // Set the download attribute to the file name
        link.download = `${fileName}.xlsx`

        // Click the link to download the file
        link.click()

        URL.revokeObjectURL(url)
      })
      .catch(error => {
        toast.error('Error generating file:')
        console.error(error)
      })
  }

  return (
    <div className='p-4 w-full flex flex-col items-center gap-2 '>
      <ToastContainer />
      <div className='flex gap-4 items-center justify-center'>
        <p
          onClick={handleResidentClick}
          className={`text-xl tracking-wide hover:cursor-pointer hover:text-gray-300 ${
            resident && 'border-b border-gray-600'
          }`}
        >
          Residents
        </p>
        <p
          onClick={handleOfficialClick}
          className={`text-xl tracking-wide hover:cursor-pointer hover:text-gray-300 ${
            official && 'border-b border-gray-600'
          }`}
        >
          Officials
        </p>
      </div>
      {resident && residentsVehicles && (
        <div className='bg-gray-500 w-3/4 md:w-1/2 rounded mx-auto p-4'>
          <div className='flex gap-5 items-center border-b pb-2 justify-center'>
            <h2 className='text-2xl'>Residents</h2>
            <button
              className='bg-white text-black py-1 px-2 rounded-sm hover:bg-slate-200'
              onClick={handleCloseMonth}
            >
              Close Month
            </button>
          </div>
          {residentsVehicles.map(vehicle => (
            <div className='py-1 flex items-center justify-between tracking-wide' key={vehicle._id}>
              <div className='flex gap-4 items-center'>
                <p className='text-sm md:text-base w-20 md:w-32'>{vehicle.licensePlate}</p>
                <div className='text-sm md:text-base'>
                  <p>{vehicle.Owner}</p>
                  <p>{vehicle.amount} MIN</p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(vehicle._id)}
                className='bg-red-500 py-2 px-1 hover:bg-red-600 rounded'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {official && officialsVehicles && (
        <div className='bg-gray-500 w-3/4 md:w-1/2 rounded mx-auto p-4'>
          <h2 className='text-2xl text-center mb-4 w-full border-b'>Officials</h2>
          {officialsVehicles.map(vehicle => (
            <div className='py-1 flex items-center justify-between tracking-wide' key={vehicle._id}>
              <div className='flex gap-4 items-center'>
                <p className='text-sm md:text-base w-20 md:w-32'>{vehicle.licensePlate}</p>
                <p className='text-sm md:text-base'>{vehicle.Owner}</p>
              </div>
              <button
                onClick={() => handleDelete(vehicle._id)}
                className='bg-red-500 py-2 px-1 hover:bg-red-600 rounded'
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
      {closeMonth && month && (
        <div className='w-full'>
          <div className='bg-gray-500 w-3/4 md:w-1/2 rounded mx-auto p-4'>
            <h2 className='text-2xl text-center mb-4 w-full border-b'>Month Closed</h2>
            <div className='flex  w-full items-center justify-between'>
              <p className='text-sm md:text-base '>LicensePlate</p>
              <p className='text-sm md:text-base '>Time</p>
              <p className='text-sm md:text-base '>Payment</p>
            </div>
            {month.map(item => (
              <div
                className='py-1 w-full flex items-center justify-between tracking-wide'
                key={item._id}
              >
                <div className='flex  w-full items-center justify-between'>
                  <p className='text-sm md:text-base '>{item.licensePlate}</p>
                  <p className='text-sm md:text-base '>{item.Time_Min} Min</p>
                  <p className='text-sm md:text-base '>{item.Payment_$MXN} $</p>
                </div>
              </div>
            ))}
            <div className='flex items-center justify-center pt-4 gap-2'>
              <input
                type='text'
                className='rounded-sm px-2 py-1   focus:outline-none  text-black'
                onChange={e => setFileName(e.target.value)}
                placeholder='32R12'
              />
              <button
                className=' py-1 px-4 bg-white hover:bg-slate-200 text-black font-semibold rounded-sm'
                onClick={handleGenerate}
              >
                Generate File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
