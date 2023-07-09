import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Global from '../helpers/Global'

export const NewRegister = ({ token }) => {
  const handleSubmit = e => {
    e.preventDefault()

    // Get the form data
    const form = e.target
    const license = form.license.value
    const owner = form.owner.value
    let vehicleType = ''
    if (owner.length <= 3) {
      alert('The name must have more than 3 characters')
      return
    }
    // Check that only one checkbox is checked
    let vehicleTypeChecked = false
    const checkboxes = form.querySelectorAll('input[type="checkbox"]')
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        if (!vehicleTypeChecked) {
          vehicleTypeChecked = true
          vehicleType = checkboxes[i].value
        } else {
          // Error: more than one checkbox checked
          alert('Please select only one vehicle type')
          return
        }
      }
    }
    // Check that at least one checkbox is checked
    if (!vehicleTypeChecked) {
      // Error: no checkbox checked
      alert('Please select a vehicle type')
      return
    }
    // Create a new vehicle object
    const vehicle = {
      licensePlate: license,
      Owner: owner,
      vehicleType: vehicleType,
    }
    fetch(Global.url + 'vehicles/create', {
      method: 'POST',
      body: JSON.stringify(vehicle),
      headers: {
        Authorization: token,
        'Content-type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'Success') {
          // Show success notification
          toast.success('Vehicle added successfully!')
        } else {
          // Show error notification
          toast.error(data.message)
        }
      })
      .catch(error => {
        // Show error notification
        toast.error('Error adding vehicle')
        console.error(error)
      })
    // Do something with the new vehicle object...
  }
  return (
    <div className='bg-slate-500 rounded-lg p-4  mx-auto'>
      <ToastContainer />
      <div className='flex px-2 flex-col'>
        <h2 className=' text-2xl tracking-wide'>New Register</h2>
        <form className='py-4' onSubmit={handleSubmit}>
          <div className='flex gap-2'>
            <div className='flex flex-col gap-2'>
              <label htmlFor='license' className='text-xl'>
                License
              </label>
              <input
                type='text'
                className='rounded-sm px-2 py-1 w-full  focus:outline-none  text-black'
                name='license'
                placeholder='321MF2'
              />
            </div>
            <div className='flex flex-col gap-2 '>
              <label htmlFor='owner' className='text-xl'>
                Owner
              </label>
              <input
                type='text'
                className='rounded-sm px-2 py-1  focus:outline-none text-black'
                name='owner'
                placeholder='John Doe'
              />
            </div>
          </div>
          <div className='flex flex-col gap-2 pt-2'>
            <label className='text-xl'>Vehicle type:</label>
            <div className='flex flex-row gap-4'>
              <label htmlFor='resident' className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='resident'
                  name='vehicleType'
                  value='resident'
                  className='rounded-sm text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
                Resident
              </label>
              <label htmlFor='official' className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  id='official'
                  name='vehicleType'
                  value='official'
                  className='rounded-sm text-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
                />
                Official
              </label>
            </div>
          </div>
          <button
            className='mt-4 py-2 px-1 w-1/2 bg-white hover:bg-slate-200 text-black font-semibold rounded-sm'
            type='Submit'
          >
            Send
          </button>
        </form>
      </div>
      <div className='px-2'>
        <div className='flex items-center '>
          <h2 className='text-lg font-semibold mr-2'>Prices :</h2>
          <div>
            <p className=' text-base '>
              Residents : <span className=' tracking-wide'>0.05$/Min</span>
            </p>
            <p className=' text-base'>
              No-Residents : <span className=' tracking-wide'>0.5$/Min</span>
            </p>
            <p className=' text-base'>
              Officials : <span className=' tracking-wide'>FREE</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
