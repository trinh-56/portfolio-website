import re

with open('/Users/trinh.56/Desktop/portfolio-website/variant-shared-design.html', 'r') as f:
    content = f.read()

# Define the old section using regex to be safe
old_section_pattern = re.compile(
    r'<section id="work" class="w-full bg-black py-40 border-t border-white/10" vid="44">.*?</section>',
    re.DOTALL
)

new_section = """<main id="work">
  <div class="zoom-container">
    <div class="heading text-center flex flex-col items-center justify-center">
      <h2 class="text-[10px] font-bold tracking-[0.3em] uppercase text-warm-beige mb-4">Service Package / 01</h2>
      <h3 class="a24-heading text-6xl md:text-8xl font-black uppercase text-white">Campaign<br>Ignition Kit</h3>
      <p class="text-[10px] font-bold tracking-[0.2em] uppercase secondary-text mt-4">One-Time Fee</p>
    </div>
    <div class="zoom-item" data-layer="2">
      <img src="image/1.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="2">
      <img src="image/2.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="1">
      <img src="image/3.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="2">
      <img src="image/4.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="3">
      <img src="image/5.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="1">
      <img src="image/1.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="3">
      <img src="image/2.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="3">
      <img src="image/3.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="1">
      <img src="image/4.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="3">
      <img src="image/5.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="2">
      <img src="image/mock.png" alt="" class="rounded-2xl">
    </div>
    <div class="zoom-item" data-layer="1">
      <img src="image/package-2.png" alt="" class="rounded-2xl">
    </div>
  </div>

  <section class="section-stick min-h-screen bg-black flex flex-col justify-center items-center text-white px-6 md:px-12 py-24">
    <div class="max-w-4xl text-center flex flex-col items-center">
        <p class="opacity-reveal text-2xl md:text-4xl text-center mb-12 leading-relaxed">
            A comprehensive asset library and strategy foundation built to launch your brand into the cultural zeitgeist. No fluff, just high-octane creative.<br><br>
            <span class="text-xl md:text-2xl text-warm-beige block mt-8">
            Brand Narrative Strategy<br>
            10 High-Fidelity Creative Assets<br>
            Copywriting Core (Ad + Web)<br>
            Audience Segmentation Map<br>
            Ready-to-launch Asset Library
            </span>
        </p>
        <button class="w-full max-w-sm py-6 border border-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-a24 inquire-btn">Inquire About Ignition</button>
    </div>
  </section>
</main>"""

content = old_section_pattern.sub(new_section, content)

# Also add the GSAP scripts right before </body>
scripts_to_add = """    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="https://assets.codepen.io/16327/ScrollSmoother.min.js"></script>
    <script src="https://assets.codepen.io/16327/SplitText3.min.js"></script>
    <script src="script.js"></script>
</body>"""

content = content.replace('    <script src="script.js"></script>\n</body>', scripts_to_add)

with open('/Users/trinh.56/Desktop/portfolio-website/variant-shared-design.html', 'w') as f:
    f.write(content)

print("HTML Replaced")
