import { AiOutlineCar } from 'react-icons/ai'
import { NewRegister } from './Components/NewRegister'
import { ParkingList } from './Components/ParkingList'
import { useEffect, useState } from 'react'
import { ListVehicles } from './Components/ListVehicles'
import { ToastContainer, toast } from 'react-toastify'
import Global from './helpers/Global'
function App() {
  const [home, setHome] = useState(true)
  const [vehicles, setVehicles] = useState(false)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
    }
  }, [])

  const handleHomeClick = () => {
    setVehicles(false)
    setHome(true)
  }
  const handleVehicleClick = () => {
    setHome(false)
    setVehicles(true)
  }
  const handleCloseSession = () => {
    localStorage.removeItem('token')
    setToken(null)
  }
  const handleLogin = e => {
    e.preventDefault()

    const formData = new FormData(e.target)
    const name = formData.get('name')
    const password = formData.get('password')

    fetch(Global.url + 'users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status == 'Success') {
          setToken(data.token)
          localStorage.setItem('token', data.token)
          toast.success('User has been login')
          return
        }
        toast.error(data.message)
      })
      .catch(error => {
        console.error(error)
        toast.error('An error occurred. Please try again later.')
      })
  }
  console.log(token)
  return (
    <div className=' text-gray-200'>
      <ToastContainer />
      {token !== null ? (
        <div className='h-screen max-w-[1240px] mx-auto py-4 md:pt-8'>
          <header className='flex items-center justify-between px-10 gap-2'>
            <div className='flex items-center gap-2'>
              <AiOutlineCar size={30} />
              <h1 className='text-2xl md:text-4xl font-semibold'>Parking Rent</h1>
            </div>
            <div className='flex items-center gap-10 mr-20'>
              <div className='flex flex-col md:flex-row gap-1 md:gap-10'>
                <p
                  onClick={handleHomeClick}
                  className={`text-xl tracking-wide hover:cursor-pointer hover:text-gray-300 ${
                    home && 'border-b border-gray-600'
                  }`}
                >
                  Home
                </p>
                <p
                  onClick={handleVehicleClick}
                  className={`text-xl tracking-wide hover:cursor-pointer hover:text-gray-300 ${
                    vehicles && 'border-b border-gray-600'
                  }`}
                >
                  Vehicles
                </p>
              </div>
              <button
                className=' tracking-wide bg-white text-black hover:bg-slate-200 py-2 px-4 rounded-xl'
                onClick={handleCloseSession}
              >
                Close Session
              </button>
            </div>
          </header>
          {home && (
            <div className='flex flex-col gap-4 md:flex-row pt-10 items-start'>
              <NewRegister token={token} />
              <ParkingList token={token} />
            </div>
          )}
          {vehicles && (
            <div className='h-screen max-w-[1240px] mx-auto py-4 md:pt-8'>
              <ListVehicles token={token} />
            </div>
          )}
        </div>
      ) : (
        <div className='h-screen w-full flex flex-col gap-4 items-center justify-center'>
          <div className='flex items-center gap-2'>
            <AiOutlineCar size={30} />
            <h1 className='text-2xl md:text-4xl font-semibold'>Parking Rent</h1>
          </div>
          <div className='bg-slate-600  tracking-wide rounded w-3/4 md:w-1/4 p-4'>
            <h1 className='text-2xl'>Login</h1>
            <form className='py-4' onSubmit={handleLogin}>
              <div className='flex flex-col gap-2'>
                <label htmlFor='license' className='text-xl'>
                  Name
                </label>
                <input
                  type='text'
                  className='rounded-sm px-2 py-1 w-full  focus:outline-none  text-black'
                  name='name'
                  placeholder='name'
                  required
                />
              </div>
              <div className='flex flex-col gap-2 '>
                <label htmlFor='owner' className='text-xl'>
                  Password
                </label>
                <input
                  type='text'
                  className='rounded-sm px-2 py-1  focus:outline-none text-black'
                  name='password'
                  placeholder='password'
                  required
                />
              </div>

              <button
                className='mt-4 py-2 px-1 w-1/2 bg-white hover:bg-slate-200 text-black font-semibold rounded-sm'
                type='Submit'
              >
                Send
              </button>
              <div className=' tracking-wide mt-2'>
                <p className='font-semibold'>Demo account</p>
                <p className='text-sm'>Name:admin</p>
                <p className='text-sm'>Password:admin</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
