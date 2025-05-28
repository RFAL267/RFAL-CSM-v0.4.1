import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import testImg from "../assets/img/spin.png";
import IconCoin from '../components/icons/icon.coin';
import IconSpinChevronLeft from '../components/icons/icon.spin.chevron.left';
import IconSpinChevronRight from '../components/icons/icon.spin.chevron.right';
import { getCasesList, postDropSkin, getUserById } from "../servises/api.service";
import { useParams } from 'react-router-dom';
import { useUser } from "../context/UserContext";

import '../css/case.spinner.css';

// 

import { useTelegramBackButton } from '../hooks/useTelegramBackButton';
import { useNavigate } from 'react-router-dom';


const ITEM_HEIGHT = 300;
const BUFFER_COPIES = 100;
///////////////////////////////////////////////
function selectItemByWeight(items) {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight === 0) return null;

  let random = Math.random() * totalWeight;

  for (const item of items) {
    if (random < item.weight) return item;
    random -= item.weight;
  }

  return null;
}

///////////////////////////////////////////////
async function doDrop(user_id, skin_id, case_id) {
  try {
    const result = await postDropSkin(user_id, skin_id,case_id);
    console.log('Результат дропа:', result);
  } catch (err) {
    console.error('Ошибка при дропе:', err);
  }
}
///

export default function InfiniteSpinner() {
  const {user} = useUser();
  const user_id = user?.id || 6032665836;
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const currentRarity = useRef(null);
  const [items, setItems] = useState([]);
  const [originalItems, setOriginalItems] = useState([]);
  const [spinning, setSpinning] = useState(false);
  const [UserData, setUserData] = useState()
  const [CaseData, setCaseData] = useState()

  const { id } = useParams();

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useTelegramBackButton(() => {
    navigate(-1); // перейти назад
  });



 useEffect(() => {
  let caseLoaded = false;
  let userLoaded = false;

  getCasesList(id)
    .then(data => {
      if (Array.isArray(data) && data.length > 0) {
        const foundCase = data.find(c => String(c.id) === String(id));
        setCaseData(foundCase);
        caseLoaded = true;
        if (userLoaded) setLoading(false);

        if (foundCase && Array.isArray(foundCase.case_skins)) {
          const transformedItems = foundCase.case_skins.map(({ skin, drop_chance }) => ({
            id: skin.id,
            title: skin.name || 'Без названия',
            subtitle: skin.type || '',
            rarity: skin.rarity,
            weight: drop_chance,
            image: skin.image_url || testImg,
          }));

          const sortedItems = transformedItems.sort((a, b) => b.weight - a.weight);
          setOriginalItems(sortedItems);

          const looped = Array.from(
            { length: transformedItems.length * BUFFER_COPIES },
            (_, i) => transformedItems[i % transformedItems.length]
          );

          setItems(looped);

          requestAnimationFrame(() => {
            if (containerRef.current) {
              const totalHeight = looped.length * ITEM_HEIGHT;
              const midpoint = totalHeight / 2;
              containerRef.current.scrollTop = midpoint;
              centerItemCheck(looped);
            }
          });
        }
      }
    })
    .catch(err => {
      console.error('Ошибка при загрузке кейсов:', err);
    });

  getUserById(user_id)
    .then(data => {
      setUserData(data);
      userLoaded = true;
      if (caseLoaded) setLoading(false);
    });
}, [id]);


const previousCenterIndex = useRef(null);

const centerItemCheck = (list = items) => {
  if (!containerRef.current || list.length === 0) return;

  const container = containerRef.current;
  const scrollCenter = container.scrollTop + container.clientHeight / 2;
  const index = Math.floor(scrollCenter / ITEM_HEIGHT);
  const currentItem = list[index];

  if (!currentItem) return;

  // Проигрываем звук, если изменился центральный индекс
  if (previousCenterIndex.current !== index) {
    previousCenterIndex.current = index;

    const sound = new Audio('/sounds/2.wav');
    sound.volume = 0.5;
    sound.play().catch(() => {});
  }

  // Обновляем фон по rarity (без влияния на звук)
  if (bgRef.current) {
    if (currentRarity.current !== currentItem.rarity) {
      currentRarity.current = currentItem.rarity;
      bgRef.current.style.background = `${currentItem.rarity}`;
    }
  }
};


  useEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0 || originalItems.length === 0) return;

    const totalHeight = items.length * ITEM_HEIGHT;

    const handleScroll = () => {
      if (container.scrollTop <= ITEM_HEIGHT * originalItems.length) {
        container.scrollTop += originalItems.length * ITEM_HEIGHT * (BUFFER_COPIES / 2);
      } else if (container.scrollTop >= totalHeight - ITEM_HEIGHT * originalItems.length) {
        container.scrollTop -= originalItems.length * ITEM_HEIGHT * (BUFFER_COPIES / 2);
      }
      centerItemCheck();
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [items, originalItems]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventScroll = (e) => {
      if (spinning) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    container.addEventListener('wheel', preventScroll, { passive: false });
    return () => container.removeEventListener('wheel', preventScroll);
  }, [spinning]);

  const handleSpin = () => {
    if (spinning || items.length === 0 || originalItems.length === 0) return;
    setSpinning(true);
    const container = containerRef.current;
    if (!container) return;

    container.classList.add('scroll-lock');

    const currentScroll = container.scrollTop;
    const currentIndex = Math.floor(currentScroll / ITEM_HEIGHT);
    const resultItem = selectItemByWeight(originalItems);

    if (!resultItem) {
      alert('❌ Не удалось выбрать предмет.');
      setSpinning(false);
      container.classList.remove('scroll-lock');
      return;
    }

    const forwardStart = currentIndex + 50;
    let targetIndex = -1;

    for (let i = forwardStart; i < items.length; i++) {
      if (items[i].id === resultItem.id) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex === -1) {
      const backwardStart = currentIndex - 50;
      for (let i = backwardStart; i >= 0; i--) {
        if (items[i].id === resultItem.id) {
          targetIndex = i;
          break;
        }
      }
    }

    if (targetIndex === -1) {
      alert('❌ Не удалось найти подходящую копию предмета.');
      setSpinning(false);
      container.classList.remove('scroll-lock');
      return;
    }

    const offsetRange = ITEM_HEIGHT / 2 - 10;
    const randomOffset = (Math.random() - 0.5) * 2 * offsetRange;

    const scrollTo =
      targetIndex * ITEM_HEIGHT -
      (container.clientHeight / 2 - ITEM_HEIGHT / 2) +
      randomOffset;

    gsap.to(container, {
      scrollTop: scrollTo,
      duration: 18,
      ease: 'power3.out',
      onUpdate: () => centerItemCheck(),
      onComplete: () => {
        alert(`🎯 Yutuq: ${resultItem.title}`);
        doDrop(user_id, resultItem.id, id);
        console.log(user_id, resultItem.id)
        setSpinning(false);
        container.classList.remove('scroll-lock');
      },
    });
  };



  return (
    <div className="spinner-root">
      <div className='spinner-bg' ref={bgRef} />

      <button 
        onClick={handleSpin} 
        disabled={loading || spinning || CaseData?.price > UserData?.balance}
        className="spin-button"
      >
        SPIN <span className='spin-price'><IconCoin />{CaseData?.price || '...'}</span>
      </button>



      <div className="spinner-center">
        <IconSpinChevronLeft />
        <IconSpinChevronRight />
      </div>
      <div ref={containerRef} className="spinner-container">
        <div>
          {items.map((item, i) => {
            const isCentered =
              containerRef.current &&
              Math.abs(
                containerRef.current.scrollTop +
                  containerRef.current.clientHeight / 2 -
                  (i * ITEM_HEIGHT + ITEM_HEIGHT / 2)
              ) < 1;

            return (
              <div
                key={`${item.id}-${i}`}
                className={`spinner-item ${isCentered ? 'centered' : ''}`}
                style={{ height: ITEM_HEIGHT }}
              >
                <img src={item.image || testImg} alt={item.title} />
                <div className='spin_content'>
                  <p className='item_name'>{item.title}</p>
                  <span className='exterior'>{item.subtitle}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
