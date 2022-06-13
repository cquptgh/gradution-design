import React from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import HomePage from '@/pages/HomePage/index'
import ProjectManage from '@/pages/ProjectManage'
import ProjectPreparation from '@/pages/ProjectPreparation'
import Demonstration from '@/pages/Demonstration'
import NotFound from '@/pages/404'

const AppRouter = () => {
  return (
    <>
      <Provider store={store}>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/project-manage" element={<ProjectManage />} />
            <Route
              path="/project-preparation/:id"
              element={<ProjectPreparation />}
            />
            <Route path="/demonstration/:id" element={<Demonstration />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </Provider>
    </>
  )
}

export default AppRouter
