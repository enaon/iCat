import { pauseDropWristScreenOff, pausePalmScreenOff, setPageBrightTime, setWakeUpRelaunch } from '@zos/display'
import finder from './finder'  

App({
    globalData: {
        devices: [],      // ΜΟΝΟ για shared state
    
    },

    onCreate(options) {
        pauseDropWristScreenOff({ duration: 360000 })
        pausePalmScreenOff({ duration: 360000 })
        setPageBrightTime({ brightTime: 360000 })
        setWakeUpRelaunch({ relaunch: true })
        
        console.log('App onCreate');
        
        // this.globalData.finder = finder; 
    },

    onDestroy(options) {
        finder.stopScan() 
        console.log('App onDestroy');
    }
});