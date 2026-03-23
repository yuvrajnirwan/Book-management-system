import React, {useState} from "react";
import BookForm from "./BookForm.tsx";
import type {Books} from "./Books.tsx";
const BookManagement=()=>{
    const [books,setBooks]=useState<Books[]>([]);
    const [filterGenre,setFilterGenre]=useState("all");

    const calculateAge = (date: string): number => {
        const currYear:number=new Date(date).getFullYear();
        const publishYear:number=new Date().getFullYear();
        return isNaN(currYear) ?0: currYear - publishYear;
    }

}
export default BookManagement;