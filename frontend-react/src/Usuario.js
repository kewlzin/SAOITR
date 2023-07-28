import { useRef, useState, useEffect, useContext } from 'react';
import AuthContext from "./context/authProvider";
import axios from './api/axios';
import md5 from 'md5';
import handleLogout from "./Logout";

