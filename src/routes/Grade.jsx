import React from 'react'
import { useState, useEffect} from 'react'
import { Link, useParams } from "react-router-dom";

import { collection, query, doc, getDocs, addDoc, updateDoc, increment, orderBy } from "firebase/firestore";
import { db } from "../firebase";

import Navbar from '../components/Navbar'

function Grade() {
    const { class_id, student_id } = useParams();

    return (
        <div>
            <Navbar/>

        </div>
    )
}

export default Grade