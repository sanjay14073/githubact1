import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Navbar, Nav, Container } from 'react-bootstrap';
import AceEditor from 'react-ace';
import { Terminal as XTerm } from 'xterm';
import 'xterm/css/xterm.css';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/theme-cobalt';

const Terminal = ({ content }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    const terminal = new XTerm();
    if (terminalRef.current) {
      terminal.open(terminalRef.current);
      terminal.write(`${content}\r\n`);
    }
    return () => {
      terminal.dispose();
    };
  }, [content]);

  return <div ref={terminalRef} style={{ height: '20vh' }} />;
};

const CodeEditor = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('java');
  const [content, setContent] = useState('');
  const [res, setRes] = useState('Not compiled yet');
  const codeLanguages = {
    java: 'java',
    javascript: 'javascript',
    python: 'python',
    cpp: 'c_cpp',
  };
  const values = {
    cpp: 'cpp',
    java: 'java',
    python: 'py',
    javascript: 'js',
  };
  function onChange(value) {
    setContent(value);
  }
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleRun = async () => {
    try {
     
      const response = await fetch('https://api.codex.jaagrav.in/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          language: values[selectedLanguage],
          code: content,
          input,
        }),
      });

      const data = await response.json();

      if (data['output'] !== ''||!typeof(data['output'])===undefined) {
        setRes(data['output']);
        console.log(data['output'])
    } else {
      setRes(data['error']);
      console.log(data['error'])
    }
    } catch (error) {
      console.error('Error occurred during API call:', error);
    }
  };

  return (
    <div className="d-flex flex-column" style={{ height: '90vh',width:'100%'}}>
      <Navbar bg="light" expand="lg" className="p-3">
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <span className="navbar-brand m-2 text-primary" onClick={() => {}}>
              Compilex-PlayGround:Editor
            </span>
            <Button variant="outline-primary" className="m-2" onClick={() => handleLanguageChange('cpp')}>
              C++
            </Button>
            <Button variant="outline-primary" className="m-2" onClick={() => handleLanguageChange('javascript')}>
              JavaScript
            </Button>
            <Button variant="outline-primary" className="m-2" onClick={() => handleLanguageChange('java')}>
              Java
            </Button>
            <Button variant="outline-primary" className="m-2" onClick={() => handleLanguageChange('python')}>
              Python
            </Button>
          </Nav>
          <Nav>
            <Button variant="success" className="m-2" onClick={handleRun} >
              Run
            </Button>
            <span className="navbar-brand m-1 text-secondary" style={{width:'100%'}}>
              Please enter the input below.
            </span>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container fluid className="flex-grow-1 p-0">
        <AceEditor
          mode={codeLanguages[selectedLanguage]}
          onChange={onChange}
          theme="cobalt"
          name="code-editor"
          fontSize={16}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          width="100%"
          height="100%"
          editorProps={{ $blockScrolling: Infinity }}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
          style={{height:'100%',width:'100%'}}
        />
         <div style={{ height: '5%',width:'100%',padding:'5px' }}>
          <h4>Enter Input Here Before Running the Code</h4>
          <input type="text" value={input} onChange={handleInputChange} />
        </div>
        <div style={{ height: '10%' ,width:'100%',padding:'5px' }}>
          
        </div>
        <div style={{ height: '5%',width:'100%' ,padding:'5px' }}>
          <h4>Here's What Your Code Produced</h4>
        </div>
        <div style={{ height: '30%',width: '100%' ,padding:'5px' }}>
          <Terminal content={res} />
        </div>
       
      </Container>
    </div>
  );
};

export default CodeEditor;

