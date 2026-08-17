import { useState } from 'react'
import './App.css'

import Login from './pages/Login'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from './pages/Dashboard'
import Clients from './lib/Clients'
import AddClients from './pages/AddClients'
import Policy from './pages/ClientPolicy'
import AddPolicy from './pages/AddPolicy'
import MorePolicyDetail from './pages/MorePolicyDetail'

import { toast, Toaster } from 'sonner'
import PolicyList from './pages/PolicyList'

function App() {

  return (
    <>
      <BrowserRouter>

        <Routes>

          <Route path="/login" element={
            <Login />
          } />
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/clients"
            element={<Clients />}
          />

          <Route
            path="/clients/policies"
            element={<PolicyList />}
          />

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
          {/* 
          <Route path="/dashboard" element={
            <Dashboard />
          } /> */}

          {/* <Route path="/clients" element={
            <Clients />
          } /> */}

          {/* <Route path="/clients/policies" element={
            <PolicyList />
          } /> */}

        </Routes>

      </BrowserRouter>

      <Toaster richColors position="top-right" />
    </>
  )
}

export default App
