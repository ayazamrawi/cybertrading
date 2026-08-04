import React, { useEffect } from "react";
import Style from "./Chart.module.css";

export default function Chart(){
    useEffect(() => {
            if (window.TradingView) {
                new window.TradingView.widget({
                    "width": "100%",
                    "height": 500,
                    "symbol": "NASDAQ:AAPL",
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": "dark",
                    "style": "1",
                    "locale": "en",
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "allow_symbol_change": true,
                    "container_id": "tradingview_aapl"
                });
            }
        }, []);
    
    return(
        <>
         <section>
                <div className={`w-75 m-auto mt-5 ${Style.tradingviewWidget}`}>
                    <div>
                        <div id="tradingview_aapl"></div>
                    </div>
                </div>
            </section>
        </>
    )
}