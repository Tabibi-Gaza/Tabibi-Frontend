import React from "react";
import { doctors } from "../assets/assets_frontend/assets";
// استيراد الـ Context من ملفه المنفصل
import { AppContext } from "./AppContext";

const AppContextProvider = (props) => {
    const value = {
        doctors
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

// هذا الملف الآن يصدر مكون React فقط (مما يرضي الـ Fast Refresh تماماً)
export default AppContextProvider;