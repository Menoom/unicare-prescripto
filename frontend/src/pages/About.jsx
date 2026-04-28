import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className='py-10'>
      <div className='text-center pt-6 mb-10'>
        <h1 className='text-2xl font-bold text-navy'>About Us</h1>
      </div>

      <div className='flex flex-col md:flex-row gap-12 mb-16'>
        <img className='w-full md:max-w-[360px] rounded-xl object-cover' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-5 md:w-2/4 text-sm text-gray-500 leading-relaxed'>
          <p>Welcome to <strong className='text-navy'>UniCare</strong>, your trusted partner in managing your healthcare needs conveniently and efficiently. We understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
          <p>UniCare is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service.</p>
          <p className='text-navy font-semibold text-base'>Our Vision</p>
          <p>Our vision is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
        </div>
      </div>

      <h2 className='text-xl font-bold text-navy mb-6'>Why Choose Us</h2>
      <div className='flex flex-col md:flex-row gap-px mb-20 rounded-xl overflow-hidden border border-gray-100'>
        {[
          { title: 'Efficiency', desc: 'Streamlined appointment scheduling that fits into your busy lifestyle.' },
          { title: 'Convenience', desc: 'Access to a network of trusted healthcare professionals in your area.' },
          { title: 'Personalization', desc: 'Tailored recommendations and reminders to help you stay on top of your health.' },
        ].map((item, i) => (
          <div key={i} className='flex-1 px-8 py-10 bg-white hover:bg-blue-50 transition-colors cursor-pointer border-r border-gray-100 last:border-r-0'>
            <p className='text-navy font-semibold mb-2'>{item.title}</p>
            <p className='text-gray-400 text-sm leading-relaxed'>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
