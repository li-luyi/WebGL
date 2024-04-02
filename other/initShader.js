//声明初始化着色器函数
function initShader(gl, vertexShaderSource, fragmentShaderSource) {
  //创建着色器对象
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  //引入着色器源代码
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  //编译着色器
  gl.compileShader(vertexShader);
  gl.compileShader(fragmentShader);
  //创建程序对象program
  var program = gl.createProgram();
  //附着着色器到program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  //链接program
  gl.linkProgram(program);
  //使用program
  gl.useProgram(program);
  //返回程序program对象
  return program;
}