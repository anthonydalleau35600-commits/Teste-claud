export const mouse = {
  rawX: 0,
  rawY: 0,
  normX: 0,
  normY: 0,
};

export function initMouseBus() {
  const update = (clientX, clientY) => {
    mouse.rawX = clientX;
    mouse.rawY = clientY;
    mouse.normX = (clientX / window.innerWidth - 0.5) * 2;
    mouse.normY = (clientY / window.innerHeight - 0.5) * 2;
  };

  window.addEventListener('mousemove', (e) => update(e.clientX, e.clientY));
  document.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0];
      update(t.clientX, t.clientY);
    },
    { passive: true }
  );
}
