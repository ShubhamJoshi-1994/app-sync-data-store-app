import React, {useState, useEffect} from 'react';
import { SketchPicker } from 'react-color';
import { Input, Button } from 'antd';
import { DataStore } from '@aws-amplify/datastore';
import { Message } from './models';

// const initialState = {color: '#000', title: ''};
const initialState = {
  title: '',
  data: null
};

function App() {
  const [formState, updateFormState] = useState(initialState);
  const [messages, updateMessages] = useState([]);
  const [showPicker, updateShowPicker] = useState(false);
  const [dataObj, setDataObj] = useState({});

  useEffect(() => {
    fetchMessages();
    const subscription = DataStore.observe(Message).subscribe(() => fetchMessages());

    return () => subscription.unsubscribe();
  }, [])


  const onChange = (e) => {
    if(e.hex) {
      updateFormState({...formState, color: e.hex});
    } else {
      updateFormState({...formState, title: e.target.value});
    }
  }

  const fetchMessages = async () => {
    const messages = await DataStore.query(Message);
    updateMessages(messages);
  }

  const createMessage = async () => {
    if (!formState.title) return;
    console.log('dataObj-ccc', dataObj);

    // await DataStore.save(new Message({...formState}));
    // updateFormState(initialState);
  }

  const setData = (e, key) => {
    dataObj[key] = e.target.value;
  }

  return (
    <div style={container}>
      <h1 style={heading}>Real Time Message Board</h1>
      <Input
        onChange={onChange}
        name='title'
        placeholder='Message title'
        value={formState.title}
        style={input}
      />

      <h4>Data</h4>
      <div>
        <div>
          <Input
            onChange={(e) => setData(e, 'first_name')}
            name='firstName'
            placeholder='First name'
            value={formState.data ? formState.data.first_name : ''}
            style={input}
          />

          <Input
            onChange={(e) => setData(e, 'last_name')}
            name='lastName'
            placeholder='Last name'
            value={formState.data ? formState.data.last_name : ''}
            style={input}
          />
        </div>
      </div>


      <div>
        <Button onClick={() => updateShowPicker(!showPicker)}style={button}>Toggle Color Picker</Button>
        <p>Color: <span style={{fontWeight: 'bold', color: formState.color}}>{formState.color}</span></p>
      </div>
      {/* {
        showPicker && <SketchPicker color={formState.color} onChange={onChange} />
      } */}
      <Button type='primary' onClick={createMessage}>Create Message</Button>
      {
        messages.map(message => (
          <div key={message.id} style={{...messageStyle, backgroundColor: message.color}}>
            <div style={messageBg}>
              <p style={messageTitle}>{message.title}</p>
            </div>
          </div>
        ))
      }
    </div>
  )
}

const container = { width: '100%', padding: 40, maxWidth: 900 }
const input = { marginBottom: 10 }
const button = { marginBottom: 10 }
const heading = { fontWeight: 'normal', fontSize: 40 }
const messageBg = { backgroundColor: 'white' }
const messageStyle = { padding: '20px', marginTop: 7, borderRadius: 4 }
const messageTitle = { margin: 0, padding: 9, fontSize: 20  }


export default App;