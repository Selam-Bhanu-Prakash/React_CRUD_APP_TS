import React, {useState, useEffect} from 'react';
import { useHistory, useParams, Link } from 'react-router-dom';
import "./AddEdit.css";
import axios from "axios";
import PhoneInput from 'react-phone-number-input/input'

const initialState = {
    name: "",
    email:"",
    contactNo:""
}

const initialError = {
    ename: "",
    eemail:"",
    econtactNo:""
}

const initialStatus = {
    name : ""
}

const initialErr = {
    error : ""
}


const AddEdit = () => {
    
    

    type User = {
        id:number;
        name: string;
        email: string;
        contactNo:number;
    };

    type Email = {
        email: string;
    };
    const [emailList,setEmailList] = useState<Email[]>([]);

    const loadData = async () => {
        const response = await axios.get("http://localhost:5000/api/get/emails");
        setEmailList(response.data);
    };
    

    const [state, setState] = useState(initialState);
    const [error, setError] = useState(initialError);

    const [inputName, setInputName] = useState(false);
    const [inputEmail, setInputEmail] = useState(false);
    const [inputphone, setInputPhone] = useState(false);

    const [status, setStatus] = useState(initialStatus);
    const [err, setErr] = useState(initialErr);

    const {name,email,contactNo} = state;
    const {ename,eemail,econtactNo} = error;
    const history = useHistory();

    const [emailMsg, setEmailMsg] = useState({text: ""});

    const [uniqueMail, setUniqueMail] = useState(true);

    const [dupMail, setDupMail] = useState({text:""});


    const {id} = useParams();

    useEffect(() => {
        loadData();
    },[state]);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/get/${id}`)
        .then((resp) => setState({ ...resp.data[0]}));

    },[id])


    const handleSubmit =  (e) => {
        e.preventDefault();
        if(!name && !email && !contactNo )
        {
            setInputName(true);
            setInputEmail(true);
            setInputPhone(true);
        }
        else if(!name){
            setInputName(true);
            setInputEmail(false);
            setInputPhone(false);
        }
        else if(!email ) {
            setInputName(false);
            setInputEmail(true);
            setInputPhone(false);
        }
        else if(!contactNo)
        {
            setInputName(false);
            setInputEmail(false);
            setInputPhone(true);
        }
        else{
            setInputName(false);
            setInputEmail(false);
            setInputPhone(false);
            const condition1 = (!email.includes("@gmail.com") || !email.endsWith("@gmail.com")) ;
            const condition2 = (!email.includes("@terralogic.com") || !email.endsWith("@terralogic.com"));
            const condition3 = (email.includes("@gmail.com@gmail.com") || email.includes("terralogic.com@terralogic.com")); 
            if((condition1 && condition2) || condition3) {               
                setEmailMsg({text:"Invalid Email ID format."});
            }
            else{
                setEmailMsg({text:""});
                if(isNaN(name.charAt(0)))
                {
                    if(contactNo.length<13)
                    {
                        setError({ename:"",eemail:"", econtactNo:"Please provide the contact number with 10 digits"});
                    }
                    else
                    {
                        setError({ename:"",eemail:"", econtactNo:""});

                        const exists = emailList.find((val) => val.email === email);
                        if(exists)
                        {
                            setDupMail({text:"Duplicate Mail ID. Please change the mail address"})
                        }
                        else
                        {
                            setDupMail({text: ""})
                        }
                        

                        if(emailList.length>0)
                        {                         
                                   
                            if(!id)
                            {
                                    
                                if(!exists)
                                {
                                    axios.post("http://localhost:5000/api/post",{
                                                name,
                                                email,
                                                contactNo
                                            })
                                            .then(()=> {
                                            setState({name: "", email: "", contactNo: ""})
                                            })
                                            .catch((err) => setErr(err.response.data))

                                            setStatus({name: "Contact Added Sucessfully"})
                                            setTimeout(() => history.push("/"), 800);  
                                }
                                                                                                  
                            }
                            else
                            {
                                setDupMail({text: ""})
                                axios.put(`http://localhost:5000/api/update/${id}`,{
                                            name,
                                            email,
                                            contactNo
                                        }).then(()=> {
                                        setState({name: "", email: "", contactNo: ""})
                                        }).catch((err) => setErr(err.response.data))
        
                                        setStatus({name: "Contact Updated Sucessfully"})
                                        setTimeout(() => history.push("/"), 800);
                            }
                        }
                        else{

                            if(!id)
                            {
                                    axios.post("http://localhost:5000/api/post",{
                                            name,
                                            email,
                                            contactNo
                                        }).then(()=> {
                                        setState({name: "", email: "", contactNo: ""})
                                        }).catch((err) => setErr(err.response.data))
                                        setStatus({name: "Contact Added Sucessfully"})
                                        setTimeout(() => history.push("/"), 800);                                                                    
                            }
                            else
                            {
                                
                                setDupMail({text: ""})
                                axios.put(`http://localhost:5000/api/update/${id}`,{
                                    name,
                                    email,
                                    contactNo
                                }).then(()=> {
                                setState({name: "", email: "", contactNo: ""})
                                }).catch((err) => setErr(err.response.data))
        
                                setStatus({name: "Contact Updated Sucessfully"})
                                setTimeout(() => history.push("/"), 800);
                            }
                        }
                    }                      
                    
                }
                else{
                    setError({ename:"User Name Should not start with a Number",eemail:"", econtactNo:""});
                } 
            }

                       
        }
    };


    const handleInputChange =  (e) => {
        const {name, value} = e.target;
        setState({...state, [name]:value});     
    };

    const handlePhoneField = (e) => {
        setState({...state, contactNo:e});
    }

  return (
    <div style={{marginTop: "100px"}}>
        <form style={{
            margin: "auto",
            padding: "15px",
            maxWidth: "400px",
            alignContent: "center"
        }}
        onSubmit={handleSubmit}
        >
            <label htmlFor="name">Name<sup className="mandatory">*</sup></label>
            <input type="text" id="name" name="name" placeholder="Enter Your name..." value={name || ""} onChange={handleInputChange}/>
            {
                error.ename && <h6>{error.ename}</h6>
            }
            {
                inputName && <h6>Please fill the Name field</h6>
                
            }
            <label htmlFor="email">Email<sup className="mandatory">*</sup></label>
            <input type="text" id="email" name="email" placeholder="Enter Your Email..." value={email || ""} onChange={handleInputChange} />
            {
                inputEmail && <h6>Please fill the Email field</h6>
            }
            {
                emailMsg.text && <h6>{emailMsg.text}</h6>
            }
            {
                dupMail.text && <h6>{dupMail.text}</h6>
            }
            <label htmlFor="contactNo">Contact No<sup className="mandatory">*</sup></label>        
            <PhoneInput
            id="contactNo"
            placeholder="Enter phone number"
            value={contactNo}
            country="IN"
            onChange={handlePhoneField}
            maxLength={11}/>
            {
                error.econtactNo && <h6>{error.econtactNo}</h6>
            }
            {
                inputphone && <h6>Please fill the Contact No field</h6>
            }
            <input type="submit" value={id ? "Update": "Save" }/>
            <Link to="/">
                <input type="button" value="Go Back" />
            </Link>
            {
                status.name && <h5>{status.name}</h5>
            }
            {
                err.error && <h6>{err.error}</h6>
            }
        </form>
    </div>
  )
}

export default AddEdit
