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
    canvas.width = width ? width : window.innerWidth - 20;
  }
  if (canvas.height !== height) {
    canvas.height = height ? height : window.innerHeight - 20;
  }
}

function setElementsCountPerAttribute(object) {
  let key = Object.keys(object)[0];
  let array = object[key];
  if (array && array.buffer instanceof ArrayBuffer) {
    return array.elementsCount;
  } else {
    return array.length / array.numsPerElement;
  }
}

function getNumsPerElementByName(name) {
  switch (name) {
    case 'colors':
      return 4;
    case 'positions':
      return 3;
    case 'normals':
      return 3;
    case 'texcoords':
      return 2;
    default:
      return 4;
  }
}
function getTypeByName(name) {
  if (name == 'colors') {
    return Uint8Array;
  }
  if (name == 'positions' || name == 'normals' || name == 'texcoords') {
    return Float32Array;
  }
  if (name == 'indices') {
    return Uint16Array;
  }
  return Float32Array;
}

function buffer2Attribute(object) {
  let map = {};
  Object.keys(object).forEach(function (name) {
    if (name == 'indices') {
      return;
    }
    map['a_' + name[0].toUpperCase() + name.substr(1, name.length - 2)] = name;
  });
  return map;
}

function makeTypedArray(data, name) {
  if (!data.numsPerElement) {
    data.numsPerElement = getNumsPerElementByName(name, data.length);
  }

  let type = getTypeByName(name);
  let typedArray = data;
  if (Array.isArray(data)) {
    typedArray = new type(data);
  }

  typedArray.numsPerElement = data.numsPerElement;
  Object.defineProperty(typedArray, 'elementsCount', {
    get: function () {
      return this.length / this.numsPerElement;
    }
  });
  return typedArray;
}

function getWebGLTypeByTypedArrayType(gl, array) {
  switch (array.constructor) {
    case Int8Array:
      return gl.BYTE;
    case Uint8Array:
      return gl.UNSIGNED_BYTE;
    case Int16Array:
      return gl.SHORT;
    case Uint16Array:
      return gl.UNSIGNED_SHORT;
    case Int32Array:
      return gl.INT;
    case Uint32Array:
      return gl.UNSIGNED_INT;
    case Float32Array:
      return gl.FLOAT;
  }
}
function getNormalize(array) {
  if (array instanceof Uint8Array || array instanceof Int8Array) {
    return true;
  }
  return false;
}

function makeAttributesInBufferInfo(gl, object) {
  let mapping = buffer2Attribute(object);
  let attributeObject = {};
  Object.keys(mapping).forEach(function (attributeName) {
    let bufferName = mapping[attributeName];
    let array = makeTypedArray(object[bufferName], bufferName);
    attributeObject[attributeName] = {
      buffer: createWebGLBuffer(gl, array),
      numsPerElement:
        array.numsPerElement || getNumsPerElementByName(bufferName),
      type: getWebGLTypeByTypedArrayType(gl, array),
      normalize: getNormalize(array)
    };
  });
  return attributeObject;
}

/**
 * 创建缓冲区
 * @param typedArray:缓冲区数据参数
 * @returns 返回缓冲区对象
 */
function createWebGLBuffer(gl, typedArray, bufferType, drawType) {
  let buffer = gl.createBuffer();
  bufferType = bufferType || gl.ARRAY_BUFFER;
  gl.bindBuffer(bufferType, buffer);
  gl.bufferData(bufferType, typedArray, drawType || gl.STATIC_DRAW);
  return buffer;
}

function createBufferInfoFromObject(gl, object) {
  let bufferInfo = {};
  bufferInfo.attributes = makeAttributesInBufferInfo(gl, object);
  let indices = object.indices;
  if (indices) {
    indices = makeTypedArray(indices, 'indices');
    bufferInfo.indices = createWebGLBuffer(
      gl,
      indices,
      gl.ELEMENT_ARRAY_BUFFER
    );
    bufferInfo.elementsCount = indices.length;
  } else {
    bufferInfo.elementsCount = setElementsCountPerAttribute(object);
  }

  return bufferInfo;
}

function setBufferInfos(gl, setters, buffers) {
  if (!buffers.attributes) {
    return;
  }
  setAttributes(setters, buffers.attributes);
  if (buffers.indices) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  }
}

function setAttributes(setters, attributes) {
  setters = setters.attributeSetters || setters;
  Object.keys(attributes).forEach(function (name) {
    let setter = setters[name];
    if (setter) {
      setter(attributes[name]);
    }
  });
}

function setUniforms(setters, values) {
  setters = setters.uniformSetters || setters;
  Object.keys(values).forEach(function (name) {
    let setter = setters[name];
    if (setter) {
      setter(values[name]);
    }
  });
}

// 列表类
function List(list) {
  this.list = list || [];
  this.uuid = this.list.length;
}
// 添加对象
List.prototype.add = function (object) {
  object.uuid = this.uuid;
  this.list.push(object);
  this.uuid++;
};
// 删除对象
List.prototype.remove = function (object) {
  this.list.splice(object.uuid, 1);
};
// 删除对象
List.prototype.get = function (index) {
  return this.list[index];
};
// 添加对象
List.prototype.forEach = function (fun) {
  this.list.forEach(fun);
};
function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  //检测是否编译正常。
  let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }
  console.error(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
/**
 *
 *
 * @param {*} gl，webgl绘图环境
 * @param {*} type，着色器类型
 * @param {*} str，着色器源码
 * @returns 返回着色器对象
 */
function createShaderFromString(gl, type, str) {
  return createShader(gl, type, str);
}
function createProgramFromString(gl, vertexString, fragmentString) {
  //创建顶点着色器
  let vertexShader = createShaderFromString(
    gl,
    gl.VERTEX_SHADER,
    vertexString
  );
  //创建片元着色器
  let fragmentShader = createShaderFromString(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentString
  );

  //创建着色器程序
  let program = createProgram(gl, vertexShader, fragmentShader);
  return program;
}