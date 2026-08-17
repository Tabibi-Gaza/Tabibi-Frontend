import React from 'react'
import Header from '../components/Header'
import PlatformStats from '../components/PlatformStats'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import TestimonialsSlider from '../components/TestimonialsSlider'
import JoiningAsDoctor from './JoiningAsDoctor'
import ScrollReveal from '../components/ScrollReveal'

const Home = () => {
    return (
      <div >
        <Header />

        <ScrollReveal animation="fadeUp"><PlatformStats /></ScrollReveal>
        <ScrollReveal animation="fadeLeft"><JoiningAsDoctor /></ScrollReveal>
        <ScrollReveal animation="fadeUp"><TopDoctors /></ScrollReveal>
        <ScrollReveal animation="fadeRight"><TestimonialsSlider /></ScrollReveal>
        <ScrollReveal animation="zoom"><Banner /></ScrollReveal>
      </div>
    );
}

export default Home