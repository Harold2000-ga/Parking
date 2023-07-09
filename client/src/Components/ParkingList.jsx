import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Global from '../helpers/Global'
import { useEffect, useState } from 'react'
import { formatDate } from '../helpers/Date'

export const ParkingList = ({ token }) => {
  const [registers, setRegisters] = useState([])
  const [query, setQuery] = useState('')

  const filteredRegisters = registers?.filter(item =>
    item.licensePlate.toLowerCase().includes(query.toLowerCase())
  )

  useEffect(() => {
    fetch(Global.url + 'registers/list/inside', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => setRegisters(data.data))
  }, [token])

  const handleSubmit = e => {
    e.preventDefault()
    const license = { licensePlate: e.target.license.value, Input: Date.now() }

    fetch(Global.url + 'registers/create', {
      method: 'POST',
      body: JSON.stringify(license),
      headers: {
        Authorization: token,
        'Content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'Success') {
          // Show success notification
          toast.success('Register added successfully!')
          setRegisters([data.data, ...registers])
        } else {
          // Show error notification
          toast.error(data.message)
        }
      })
      .catch(error => {
        // Show error notification
        toast.error('Error adding register')
        console.error(error)
      })
  }
  const handleOut = id => {
    fetch(Global.url + 'registers/register/' + id, {
      method: 'PUT',
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status == 'Success') {
          setRegisters(registers.filter(item => item._id !== id))
        }
        if (data.data.vehicleType == 'resident' || data.data.vehicleType == 'official') {
          alert('Dont have to paid is ' + data.data.vehicleType)
          return
        }
        toast.warn(`Have to pay $${data.data.Payment} has been ${data.data.timeIn} MIN`, {
          position: toast.POSITION.TOP_CENTER,
          autoClose: false,
          hideProgressBar: true,
        })
      })
  }
  return (
    <div className='p-4 h-full max-w-[600px] rounded w-full bg-slate-500 mx-auto'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-2 py-2 '>
          <label htmlFor='license' className='text-lg tracking-wide'>
            Intro the Vehicle
          </label>
          <div className='flex items-center gap-2'>
            <input
              type='text'
              className='rounded-sm px-2 py-1   focus:outline-none  text-black'
              name='license'
              placeholder='32R12'
            />
            <button
              className=' py-1 px-4 bg-white hover:bg-slate-200 text-black font-semibold rounded-sm'
              type='Submit'
            >
              Input
            </button>
          </div>
        </div>
      </form>

      <h2 className='text-2xl tracking-wide py-5'>
        {' '}
        Vehicles Inside the Parking ({registers.length})
      </h2>
      <input
        className='py-1 px-2 rounded-sm text-black focus:outline-none'
        name={query}
        onChange={e => setQuery(e.target.value)}
        type='text'
        placeholder='Search by license'
      />
      <h1 className='text-black py-2 text-sm'>Showing Last 5 Inputs</h1>
      {filteredRegisters ? (
        filteredRegisters?.slice(0, 5).map(register => (
          <div
            className='py-1 flex items-center justify-between tracking-wide max-h-[600px]'
            key={register._id}
          >
            <div className='flex gap-4 items-center'>
              <p className='text-sm md:text-base'>{register.licensePlate}</p>

              <div>
                <p>{register.vehicleType}</p>
                <p>{formatDate(register.Input)}</p>
              </div>
            </div>
            <button
              onClick={() => handleOut(register._id)}
              className='bg-red-500 py-2 px-1 hover:bg-red-600 rounded'
            >
              Output
            </button>
          </div>
        ))
      ) : (
        <h2 className='text-2xl'> The Parking is empty</h2>
      )}
    </div>
  )
}
