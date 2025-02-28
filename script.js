document.addEventListener("DOMContentLoaded", function() {
  var container = document.getElementById("envelope");
  var loader = document.getElementById("loader");

  // 定义每个步骤的媒体文件信息
  var mediaFiles = {
    1: { type: "video", src: "videos/step1.mp4", loop: true },
    2: { type: "video", src: "videos/step2.mp4", loop: false },
    3: { type: "video", src: "videos/step3.mp4", loop: true },
    4: { type: "video", src: "videos/step4.mp4", loop: false },
    5: { type: "image", src: "images/step5.png" }
  };

  // 缓存预加载好的媒体元素
  var preloaded = {};
  var preloadPromises = [];

  // 遍历 mediaFiles，预加载每个文件
  Object.keys(mediaFiles).forEach(function(step) {
    var file = mediaFiles[step];
    if (file.type === "video") {
      var video = document.createElement("video");
      video.muted = true;
      video.setAttribute("playsinline", "true");
      video.autoplay = false;
      video.playsInline = true;
      video.loop = file.loop;
      video.style.width = "100%";
      video.style.height = "100%";
      var source = document.createElement("source");
      source.type = "video/mp4";
      source.src = file.src;
      video.appendChild(source);
    
      // 判断设备类型，桌面端使用 oncanplaythrough，移动端使用 onloadeddata
      var isMobile = /Mobi|Android/i.test(navigator.userAgent);
      var preloadEvent = isMobile ? "loadeddata" : "canplaythrough";
    
      var promise = new Promise(function(resolve, reject) {
        var resolved = false;
        // 定义一个清理函数，移除事件监听和清除超时
        function cleanup() {
          video.removeEventListener(preloadEvent, onEvent);
          clearTimeout(timeoutId);
        }
        function onEvent() {
          if (!resolved) {
            resolved = true;
            cleanup();
            resolve();
          }
        }
        video.addEventListener(preloadEvent, onEvent);
        video.onerror = function(e) {
          if (!resolved) {
            resolved = true;
            cleanup();
            reject(e);
          }
        };
        // 设置超时，比如3秒后自动解决预加载
        var timeoutId = setTimeout(function() {
          if (!resolved) {
            console.warn("预加载超时，自动解决视频预加载，step: ", step);
            resolved = true;
            cleanup();
            resolve();
          }
        }, 3000);
      });
      
      video.load();
      preloaded[step] = video;
      preloadPromises.push(promise);
    }
  });

  // 等待所有媒体文件预加载完成后，隐藏加载动画并开始播放第一步
  Promise.all(preloadPromises).then(function() {
    loader.style.display = "none";  // 隐藏加载动画
    startStep(1);  // 从 step1 开始播放
  }).catch(function(err) {
    console.error("媒体预加载错误：", err);
  });

  var finished = false;
  // 切换步骤函数，根据不同步骤显示对应的媒体
  function startStep(step) {
    if (finished) return;
    currentStep = step;
    container.innerHTML = "";
    if (mediaFiles[step].type === "video") {
      var video = preloaded[step];
      video.currentTime = 0;
      container.appendChild(video);
      video.play().catch(function(e) {
        console.error("播放错误：", e);
      });
      // 根据需求设置点击和结束事件：
      // 在 step1 和 step3 点击切换到下一步，
      // 在 step2 和 step4 播放结束后自动切换
      video.onclick = function() {
        if (step === 1) {
          startStep(2);
        } else if (step === 3) {
          startStep(4);
        }
      };
      video.onended = function() {
        // 仅处理当前视频的 onended，防止多次触发
        video.onended = null;
        if (step === 2) {
          startStep(3);
        } else if (step === 4) {
          finished = true;  // 设置最终状态
          startStep(5);
        }
      };
    } else {
      // 如果是图片（step5）
      // 为图片添加 className 或直接设置样式
      preloaded[step].className = "card-image"; // 确保图片应用 CSS 样式
      container.appendChild(preloaded[step]);
    }
  }
});