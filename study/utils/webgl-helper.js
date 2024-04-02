/**
 * 获取canvas
 * @param id
 * @returns canvas元素
 */
function getCanvas(id) {
  return document.getElementById(id)
}

/**
 * 获取webgl绘图环境
 * @param canvas
 * @returns webgl环境
 */
function getWebGLContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
}

/**
 * 创建着色器
 * @param gl
 * @param type 创建的着色器对象类型  gl.VERTEX_SHADER 表示顶点着色器，gl.FRAGEMENT_SHADER 表示片元着色器
 * @param id 顶点着色器的script id
 * @returns 着色器对象
 */
function createShaderFromScript(gl, type, id) {
  //顶点着色器源码
  var shaderSource = document.getElementById(id).innerText;
  //创建着色器对象
  var shader = gl.createShader(type);
  //引入着色器源代码
  gl.shaderSource(shader, shaderSource);
  //编译着色器
  gl.compileShader(shader);
  return shader
}

/**
 * 创建着色器程序
 * @param gl 
 * @param vertexShader 
 * @param fragmentShader 
 * @returns 
 */
function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram()
  // 将顶点着色器挂载到程序上
  gl.attachShader(program, vertexShader)
  // 将片元着色器挂载到程序上
  gl.attachShader(program, fragmentShader)
  // 链接着色器程序
  gl.linkProgram(program)
  return program
}

/**
 * 生成随机rgba的颜色对象
 * @returns rgba
 */
function randomColor(alpha) {
  alpha = alpha == undefined ? (Math.random() * 10 / 10).toFixed(1) : alpha;
  alpha = Number(alpha);
  if (isNaN(alpha)) alpha = 1;
  return {
    r: parseInt(Math.random() * 256),
    g: parseInt(Math.random() * 256),
    b: parseInt(Math.random() * 256),
    a: alpha
  }
}

/**
 * 纹理贴图加载
 * @param gl
 * @param src 图片路径
 * @param attribute 贴图变量
 * @param callback 加载后回调
 * @returns 
 */
function loadTexture(gl, src, attribute, callback) {
  let img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = function () {
    gl.activeTexture(gl.TEXTURE0);
    let texture = gl.createTexture();
    // 创建贴图缓冲区
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameterf(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.uniform1i(attribute, 0);
    callback && callback();
  };
  img.src = src;
}

/**
 * 创建缓冲区
 * @param 
 * @returns 
 */
function createBuffer(gl, target = gl.ARRAY_BUFFER, data, attribute, size, stride = 0, offset = 0) {
  const buffer = gl.createBuffer()
  gl.bindBuffer(target, buffer)
  gl.bufferData(target, data, gl.STATIC_DRAW)
  gl.vertexAttribPointer(attribute, size, gl.FLOAT, false, stride, offset)
  gl.enableVertexAttribArray(attribute)
}

/**
 * 屏幕宽高自适应
 * @param 
 * @returns 
 */
function resizeCanvas(canvas, width, height) {
  if (canvas.width !== width) {
    canvas.width = width ? width : window.innerWidth;
  }
  if (canvas.height !== height) {
    canvas.height = height ? height : window.innerHeight;
  }
}