import React from 'react'
import Header from '../components/Header'
import PlatformStats from '../components/PlatformStats'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import TestimonialsSlider from '../components/TestimonialsSlider'

const Home = () => {
    return (
        <div>
            <Header />
            <PlatformStats />
            <TopDoctors />
            <TestimonialsSlider />
            <Banner />

        </div>
    )
}

export default Home