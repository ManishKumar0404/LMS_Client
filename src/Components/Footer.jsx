import { BsFacebook, BsInstagram, BsLinkedin, BsTwitter, BsWhatsapp } from 'react-icons/bs';

function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();

  return (
    <>
      <footer className='relative left-0 bottom-0 h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-800 sm:px-20'>
        <section className='text-lg'>
          Copyright {year} | All rights reserved
        </section>

        <section className='flex items-center justify-center gap-5 text-2xl text-white'>
          <a
            href="https://www.facebook.com/your.profile"
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-yellow-500 transition-all ease-in-out duration-300'
          >
            <BsFacebook />
          </a>
          <a
            href="https://wa.me/8340178854"
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-yellow-500 transition-all ease-in-out duration-300'
          >
            <BsWhatsapp />
          </a>
          <a
            href="https://www.instagram.com/rohit.singh__l"
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-yellow-500 transition-all ease-in-out duration-300'
          >
            <BsInstagram />
          </a>
          <a
            href="https://www.linkedin.com/in/rohit-kumar-966116343"
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-yellow-500 transition-all ease-in-out duration-300'
          >
            <BsLinkedin />
          </a>
          <a
            href="https://www.twitter.com/yourhandle"
            target="_blank"
            rel="noopener noreferrer"
            className='hover:text-yellow-500 transition-all ease-in-out duration-300'
          >
            <BsTwitter />
          </a>
        </section>
      </footer>
    </>
  );
}

export default Footer;
