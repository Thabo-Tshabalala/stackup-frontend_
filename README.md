# StackUp - Stokvel & Savings Pool Platform

> A modern, mobile-first platform for managing stokvels, savings pools, and rotating credit systems. Track contributions, payouts, and member cycles with ease.

---

## Features

- **Payout Scheduling**: Visualize the order in which members receive the full pot.  
- **Cycle Tracking**: Each member gets their turn — clearly marked as *Paid*, *Next Up*, or *Pending*.  
- **Mobile-Responsive UI**: Works seamlessly on phones, tablets, and desktops.  
- **Backend**: Spring Boot + MySQL on Railway with encrypted connections.  
- **WhatsApp Integration**: Receive WhatsApp notifications for every transaction, member contribution, or invite.  
- **Send Money**: Send money using WhatsApp number or email.

---

## 🚀 Live Demo

- **Frontend**: https://stackup-frontend-eight.vercel.app/

> Try it out!

---

## 🛠️ Tech Stack

| Layer       | Technology                              |
|------------|----------------------------------------|
| **Frontend** | React, Tailwind CSS, Axios              |
| **Backend**  | Spring Boot (Java), JPA/Hibernate      |
| **Database** | MySQL (on Railway)                     |
| **Hosting**  | Railway (Backend), Vercel (Frontend)   |
| **Auth**     | JWT                                    |

---

## Setup

### Backend

---bash
git clone https://github.com/Thabo-Tshabalala/stack-up-backend.git
cd stack-up-backend
Set up environment variables (example .env):

env
Copy code
MYSQL_DATABASE=railway
MYSQL_USER=root
MYSQL_PASSWORD=your_password
WHATSAPP_ACCESS_TOKEN=your_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_id
Run the backend:


# or use your IDE to run the Spring Boot application

# Frontend

git clone https://github.com/Thabo-Tshabalala/stack-up-frontend.git
cd stack-up-frontend
npm install
npm run dev
The frontend will run on port 3000 by default.

#Usage
Create an account and log in.

- Create a pool and invite members.

- Members can accept or decline invites.

- Send money using email or phone number.

- Check balance and pool progress.

- Contribute to a pool and receive automatic payments when the pool is full.

- Track who paid and receive money using your registered number.

- Monitor all transactions.
