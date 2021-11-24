import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

import styles from './styles/Graph.module.css';

/**
 * Defining the socket connection
 */
const socket = io('ws://127.0.0.1:3001', {transports: ['websocket']});

/**
 * Renders the graph screen
 */
const Graph = ({title}) => {
  /**
   * Storing x and y values
   */
  const [xValues, setXValues] = useState([])
  const [yValues, setYValues] = useState([])
  
  const [connectionStatus, setConnectionStatus] = useState('Not connected!')

  /**
   * Establishing the socket connection on mount
   * on data channel
   */
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
      setConnectionStatus('Connected!')
    });
    
    socket.on('data', ({timestamp, value}) => {
      setXValues((currXValues) => [...currXValues, timestamp])
      setYValues((currYValues) => [...currYValues, value])
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Not connected!')
    })

  }, [])

  /**
   * Function used to stop the socket.io connection
   */
  const stopServer = () => {
    console.log('Stopping server...')
    socket.disconnect()
  }

  return (
    <div className={styles.masterContainer}>
      <h1 className={styles.header}>{title}</h1>
      <Plot 
        className={styles.plot}
        useResizeHandler
        data={
          [
            {
              x: xValues,
              y: yValues,
              type: 'scatter',
              line: {color: '#e74c3c'},
            }
          ]
        }
        layout={
          {
            annotations: [{
              xref: 'paper',
              yref: 'paper',
              x: 0.5,
              y: -0.1,
              xanchor: 'center',
              yanchor: 'top',
              text: 'Time',
              showarrow: false,
              font: {
                family: 'Arial',
                size: 12,
                color: 'rgb(150,150,150)'
              }
            }],
            autosize: true
          }
        }
      />
      <div className={styles.buttonContainer}>
        <button onClick={() => window.location.reload()} className={`${styles.btn} ${styles.startBtn}`}>Restart server</button>
        <button onClick={stopServer} className={`${styles.btn} ${styles.stopBtn}`}>Stop server</button>
      </div>
      <p className={styles.status}><b>Status:</b> {connectionStatus}</p>
    </div>
  );
}

export default Graph;
