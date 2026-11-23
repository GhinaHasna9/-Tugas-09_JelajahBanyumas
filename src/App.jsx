import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ItemDetail from './components/ItemDetail.jsx'
import HomePage from './components/HomePage.jsx'
import AboutSection from './components/AboutSection.jsx'
import DestinationList from './components/DestinationList.jsx'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import PhotoCredits from './components/PhotoCredits.jsx'
import VisitPlanList from './components/VisitPlanList.jsx'
import { initialDestinations } from './data/destinations.js'
import { culinaryHighlights } from './data/culinary.js'
import { addVisitPlan, deleteVisitPlan, editVisitPlan, getVisitPlans } from './api/visitPlans.js'
import './App.css'

const catalogItems = [...initialDestinations, ...culinaryHighlights]

function App() {
  const [visitPlans, setVisitPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let active = true
    getVisitPlans()
      .then((plans) => {
        if (active) setVisitPlans(plans)
      })
      .catch((error) => {
        if (active) setLoadError(error.message)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => { active = false }
  }, [])

  async function handleAddPlan(data) {
    const created = await addVisitPlan(data)
    setVisitPlans((current) => [...current, created])
    setLoadError('')
  }

  async function handleUpdatePlan(id, data) {
    const updated = await editVisitPlan(id, data)
    setVisitPlans((current) => current.map((plan) => plan.id === id ? updated : plan))
  }

  async function handleDeletePlan(id) {
    await deleteVisitPlan(id)
    setVisitPlans((current) => current.filter((plan) => plan.id !== id))
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage destinations={initialDestinations} />} />
          <Route path="/destinasi" element={<DestinationList items={catalogItems} />} />
          <Route path="/destinasi/:slug" element={<ItemDetail items={catalogItems} itemType="wisata" />} />
          <Route path="/kuliner/:slug" element={<ItemDetail items={catalogItems} itemType="kuliner" />} />
          <Route path="/tentang" element={<AboutSection />} />
          <Route path="/kredit-foto" element={<PhotoCredits />} />
          <Route
            path="/rencana-kunjungan"
            element={
              <VisitPlanList
                items={initialDestinations}
                plans={visitPlans}
                isLoading={isLoading}
                loadError={loadError}
                onAddPlan={handleAddPlan}
                onUpdatePlan={handleUpdatePlan}
                onDeletePlan={handleDeletePlan}
              />
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
