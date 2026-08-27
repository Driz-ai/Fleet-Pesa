import re


<<<<<<< HEAD
def normalize_kenyan_phone(value):
    """
    Normalize Kenyan mobile numbers to 07XXXXXXXX.
=======
def normalize_kenyan_phone(phone):
    """
    Normalize Kenyan phone numbers to +254XXXXXXXXX.
>>>>>>> 9365cf1d06083a6dd71c2d36676154f1b901de8a

    Accepted:
        0712345678
        0112345678
        254712345678
        +254712345678

<<<<<<< HEAD
    Stored/returned:
        0712345678
    """

    if value is None:
        raise ValueError("Phone number is required.")

    phone = str(value).strip()

    # Remove spaces, dashes and brackets
    phone = re.sub(r"[\s\-()]", "", phone)

    # Convert +254712345678 -> 0712345678
    if phone.startswith("+254"):
        phone = "0" + phone[4:]

    # Convert 254712345678 -> 0712345678
    elif phone.startswith("254"):
        phone = "0" + phone[3:]

    # Validate Kenyan mobile number
    if not re.fullmatch(r"07\d{8}", phone):
        raise ValueError(
            "Enter a valid Kenyan phone number, e.g. 0712345678"
=======
    Returns:
        +254712345678
    """

    if phone is None:
        raise ValueError("Phone number is required.")

    phone = phone.strip()

    if not phone:
        raise ValueError("Phone number is required.")

    # Remove spaces, hyphens and brackets.
    phone = re.sub(r"[\s\-()]", "", phone)

    # Convert 07XXXXXXXX / 01XXXXXXXX
    # to +2547XXXXXXXX / +2541XXXXXXXX
    if phone.startswith(("07", "01")):
        phone = "+254" + phone[1:]

    # Convert 2547XXXXXXXX / 2541XXXXXXXX
    # to +2547XXXXXXXX / +2541XXXXXXXX
    elif phone.startswith("254"):
        phone = "+" + phone

    # Validate canonical format.
    if not re.fullmatch(r"\+254[17]\d{8}", phone):
        raise ValueError(
            "Invalid Kenyan phone number. "
            "Use a valid number such as +254712345678."
>>>>>>> 9365cf1d06083a6dd71c2d36676154f1b901de8a
        )

    return phone
