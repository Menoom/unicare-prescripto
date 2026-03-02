import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import doctorModel from './models/doctorModel.js'

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database Connected')

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('12345678', salt)

        const doctors = [
            {
                name: 'Dr. Arjun Mehta',
                email: 'arjun@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
                speciality: 'General physician',
                degree: 'MBBS',
                experience: '4 Years',
                about: 'Dr. Arjun Mehta has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.',
                available: true,
                fees: 500,
                address: { line1: '12th Main, Koramangala', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Priya Sharma',
                email: 'priya@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
                speciality: 'Gynecologist',
                degree: 'MBBS, MD',
                experience: '6 Years',
                about: 'Dr. Priya Sharma specializes in women\'s health with extensive experience in prenatal care, reproductive health, and gynecological surgeries.',
                available: true,
                fees: 600,
                address: { line1: '5th Block, Jayanagar', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Rahul Verma',
                email: 'rahul@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/men/45.jpg',
                speciality: 'Dermatologist',
                degree: 'MBBS, MD',
                experience: '3 Years',
                about: 'Dr. Rahul Verma is a skilled dermatologist with expertise in treating skin conditions, cosmetic dermatology, and advanced skin care treatments.',
                available: true,
                fees: 400,
                address: { line1: '8th Cross, Indiranagar', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Sneha Iyer',
                email: 'sneha@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/women/65.jpg',
                speciality: 'Pediatricians',
                degree: 'MBBS, MD',
                experience: '5 Years',
                about: 'Dr. Sneha Iyer is dedicated to providing quality healthcare for children, from newborns to adolescents, with a focus on developmental and preventive care.',
                available: true,
                fees: 450,
                address: { line1: '3rd Stage, Basaveshwaranagar', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Vikram Reddy',
                email: 'vikram@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/men/52.jpg',
                speciality: 'Neurologist',
                degree: 'MBBS, DM',
                experience: '8 Years',
                about: 'Dr. Vikram Reddy has deep expertise in diagnosing and treating disorders of the nervous system including stroke, epilepsy, and neurodegenerative diseases.',
                available: true,
                fees: 700,
                address: { line1: '14th Cross, Malleshwaram', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Ananya Das',
                email: 'ananya@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/women/33.jpg',
                speciality: 'Gastroenterologist',
                degree: 'MBBS, DM',
                experience: '4 Years',
                about: 'Dr. Ananya Das specializes in the diagnosis and treatment of digestive system disorders, including liver diseases, IBD, and GI-related conditions.',
                available: true,
                fees: 550,
                address: { line1: '2nd Main, HSR Layout', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Karan Singh',
                email: 'karan@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/men/64.jpg',
                speciality: 'General physician',
                degree: 'MBBS',
                experience: '2 Years',
                about: 'Dr. Karan Singh is a compassionate general physician focused on holistic patient care, chronic disease management, and health education.',
                available: true,
                fees: 350,
                address: { line1: '6th Cross, BTM Layout', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Meera Nair',
                email: 'meera@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/women/55.jpg',
                speciality: 'Gynecologist',
                degree: 'MBBS, MS',
                experience: '10 Years',
                about: 'Dr. Meera Nair is a senior gynecologist with over a decade of experience in high-risk pregnancies, minimally invasive surgeries, and fertility treatments.',
                available: true,
                fees: 800,
                address: { line1: '9th Main, Whitefield', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Rohan Kapoor',
                email: 'rohan@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/men/75.jpg',
                speciality: 'Dermatologist',
                degree: 'MBBS, DVD',
                experience: '5 Years',
                about: 'Dr. Rohan Kapoor specializes in acne treatment, hair restoration, laser therapy, and managing chronic skin conditions like psoriasis and eczema.',
                available: true,
                fees: 500,
                address: { line1: '11th Cross, JP Nagar', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
            {
                name: 'Dr. Divya Gupta',
                email: 'divya@unicare.com',
                password: hashedPassword,
                image: 'https://randomuser.me/api/portraits/women/22.jpg',
                speciality: 'Neurologist',
                degree: 'MBBS, DM',
                experience: '6 Years',
                about: 'Dr. Divya Gupta focuses on movement disorders, headache management, and neurological rehabilitation with a patient-first approach.',
                available: true,
                fees: 650,
                address: { line1: '4th Block, Rajajinagar', line2: 'Bangalore, Karnataka' },
                date: Date.now(),
                slots_booked: {}
            },
        ]

        await doctorModel.deleteMany({})
        console.log('Cleared existing doctors')

        await doctorModel.insertMany(doctors)
        console.log(`Seeded ${doctors.length} doctors successfully!`)

        await mongoose.disconnect()
        console.log('Database Disconnected')

    } catch (error) {
        console.error('Seeding failed:', error.message)
        process.exit(1)
    }
}

seedDoctors()
