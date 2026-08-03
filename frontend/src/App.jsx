import { useState } from 'react'
import './App.css'

import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import AddClients from './pages/AddClients'
import Policy from './pages/Policy'
import AddPolicy from './pages/AddPolicy'
import MorePolicyDetail from './pages/MorePolicyDetail'
import EditPolicy from './pages/EditPolicy'

import { toast, Toaster } from 'sonner'
import EditClient from './pages/EditClient'
import AllPoliciesDetails from './pages/AllPoliciesDetails'
import DueToday from './pages/DueToday'
import CardPolicies from './pages/CardPolicies'

function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route path="/login" element={
            <Login />
          } />

          <Route path="/dashboard" element={
            <Dashboard />
          } />
          
          <Route path="/clients" element={
            <Clients />
          } />

          <Route path="/clients/add-clients" element={
            <AddClients />
          } />

          <Route path="/clients/policy/:id" element={
            <Policy />
          } />

          <Route path="/clients/policy/add-policy/:id" element={
            <AddPolicy />
          } />

          <Route path="/clients/policy/more-info/:clientId/:id" element={
            <MorePolicyDetail />
          } />

          <Route path="/clients/policy/more-info/:id" element={
            <MorePolicyDetail />
          } />

          <Route path="/clients/policy/more-info/edit/:clientId/:id" element={
            <EditPolicy />
          } />

          <Route path="/clients/edit/:clientId" element={
            <EditClient />
          } />

          <Route path="/clients/policies" element={
            <CardPolicies />
          } />

        </Routes>

      </BrowserRouter>

      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
