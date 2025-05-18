import { useEffect, useRef, useState } from 'react';

const QuillEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Write something...', 
  outputFormat = 'html', // 'html', 'text', or 'delta'
  toolbar = 'standard' // 'standard', 'minimal', 'full'
}) => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  
  // Load Quill from CDN - only once per page
  useEffect(() => {
    // Create a flag on window to prevent multiple loads
    if (window._quillLoaded) {
      setIsLoaded(true);
      return;
    }

    const loadQuill = async () => {
      try {
        // Add a CSS class to know if our styles are loaded
        const styleId = 'quill-editor-styles';
        if (!document.getElementById(styleId)) {
          const linkQuill = document.createElement('link');
          linkQuill.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
          linkQuill.rel = 'stylesheet';
          linkQuill.id = styleId;
          document.head.appendChild(linkQuill);
        }
        
        // Only load the script if it doesn't exist
        if (!window.Quill) {
          return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
            script.id = 'quill-editor-script';
            script.async = true;
            script.onload = () => {
              window._quillLoaded = true;
              resolve();
            };
            document.body.appendChild(script);
          });
        }
      } catch (error) {
        console.error('Error loading Quill:', error);
      }
    };

    loadQuill().then(() => {
      setIsLoaded(true);
    });
  }, []);

  // Get toolbar configuration based on props
  const getToolbarOptions = () => {
    switch (toolbar) {
      case 'minimal':
        return [
          ['bold', 'italic'],
          ['link']
        ];
      case 'full':
        return [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'script': 'sub' }, { 'script': 'super' }],
          [{ 'indent': '-1' }, { 'indent': '+1' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'font': [] }],
          [{ 'align': [] }],
          ['clean'],
          ['link', 'image', 'video']
        ];
      case 'standard':
      default:
        return [
          ['bold', 'italic', 'underline'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          [{ 'header': [1, 2, 3, false] }],
          ['link'],
          ['clean']
        ];
    }
  };

  // Format the output based on selected format
  const formatOutput = () => {
    if (!quillRef.current) return '';
    
    switch (outputFormat) {
      case 'text':
        const text = quillRef.current.getText();
        return text ? text.trim() : '';
      case 'delta':
        return quillRef.current.getContents();
      case 'html':
      default:
        return quillRef.current.root.innerHTML;
    }
  };

  // Initialize Quill when loaded
  useEffect(() => {
    // Wait for Quill to be available and the ref to exist
    if (!isLoaded || !editorRef.current || !window.Quill || isInitialized) return;
    
    try {
      // Clean up any previous instance
      if (quillRef.current) {
        quillRef.current = null;
      }
      
      // Reset the editor content
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
      
      // Initialize with options
      const options = {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: getToolbarOptions()
        },
        bounds: editorRef.current
      };

      // Create new instance
      quillRef.current = new window.Quill(editorRef.current, options);
      
      // Set initial content if provided
      if (value) {
        // For HTML input
        if (outputFormat === 'html') {
          quillRef.current.root.innerHTML = value;
        } 
        // For plain text input
        else if (outputFormat === 'text') {
          quillRef.current.setText(value);
        }
      }
      
      // Set up change handler
      quillRef.current.on('text-change', () => {
        try {
          const newValue = formatOutput();
          console.log('Editor change detected, new value:', newValue);
          setLocalValue(newValue);
          if (onChange) {
            // Ensure we're calling onChange with the new value
            onChange(newValue);
            console.log('onChange called with:', newValue);
          }
        } catch (err) {
          console.error('Error in text-change handler:', err);
        }
      });
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Error initializing Quill:', error);
    }
  }, [isLoaded, editorRef.current, window.Quill]);
  
  // Handle external value changes
  useEffect(() => {
    if (!isInitialized || !quillRef.current) return;
    
    // Only update if the value changed and wasn't set internally
    if (value !== localValue) {
      setLocalValue(value);
      
      // Update based on format type
      if (outputFormat === 'html') {
        quillRef.current.root.innerHTML = value || '';
      } else if (outputFormat === 'text') {
        quillRef.current.setText(value || '');
      }
    }
  }, [value, isInitialized]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (quillRef.current) {
        // Remove handlers to prevent memory leaks
        quillRef.current.off('text-change');
      }
    };
  }, []);

  return (
    <div className="w-full quill-editor-container">
      {!isLoaded && (
        <div className="flex justify-center items-center h-48 bg-gray-50 rounded border border-gray-200">
          <p className="text-gray-500">Loading editor...</p>
        </div>
      )}
      <div 
        className={`bg-white ${!isLoaded ? 'hidden' : ''}`}
        style={{ minHeight: '200px' }}
      >
        <div 
          ref={editorRef} 
          className="h-48" 
          style={{ border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
    </div>
  );
};

export default QuillEditor;