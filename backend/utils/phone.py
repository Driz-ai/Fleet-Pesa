import re


def normalize_kenyan_phone(phone):




    if phone is None:
        raise ValueError("Phone number is required.")

    phone = str(phone).strip()

    if not phone:
        raise ValueError("Phone number is required.")

    # Remove spaces, hyphens and brackets
    phone = re.sub(r"[\s\-()]", "", phone)

    # Only accept local Kenyan format:
    # 07XXXXXXXX
    # 01XXXXXXXX
    #
    # Exactly 10 digits.
    if not re.fullmatch(r"0[17]\d{8}", phone):
        raise ValueError(
            "Invalid Kenyan phone number. "
            "Use a local number such as 0712345678 "
            "or 0112345678."
        )

    return phone
